
-- tasks: categories
ALTER TABLE public.tasks ADD COLUMN category text NOT NULL DEFAULT 'website_visit';
ALTER TABLE public.tasks ADD COLUMN icon text NOT NULL DEFAULT '';
ALTER TABLE public.tasks ADD COLUMN instructions text NOT NULL DEFAULT '';
UPDATE public.tasks SET category = 'website_visit';

-- profiles
ALTER TABLE public.profiles ADD COLUMN avatar_url text;
ALTER TABLE public.profiles ADD COLUMN vip_plan_id uuid;
ALTER TABLE public.profiles ADD COLUMN vip_expires_at timestamptz;

CREATE OR REPLACE FUNCTION public.protect_profile_columns()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') OR auth.uid() IS NULL THEN RETURN NEW; END IF;
  NEW.balance := OLD.balance;
  NEW.total_withdrawn := OLD.total_withdrawn;
  NEW.referral_earning := OLD.referral_earning;
  NEW.referral_code := OLD.referral_code;
  NEW.referred_by := OLD.referred_by;
  NEW.is_blocked := OLD.is_blocked;
  NEW.email := OLD.email;
  NEW.vip_plan_id := OLD.vip_plan_id;
  NEW.vip_expires_at := OLD.vip_expires_at;
  RETURN NEW;
END; $$;

-- settings (single row)
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  spin_fee numeric NOT NULL DEFAULT 5,
  spin_prizes jsonb NOT NULL DEFAULT '[0,2,3,5,8,10,15,25]'::jsonb,
  ad_top text NOT NULL DEFAULT '',
  ad_middle text NOT NULL DEFAULT '',
  ad_bottom text NOT NULL DEFAULT '',
  ad_interstitial text NOT NULL DEFAULT '',
  support_whatsapp text NOT NULL DEFAULT '',
  support_telegram text NOT NULL DEFAULT '',
  support_email text NOT NULL DEFAULT '',
  bkash_number text NOT NULL DEFAULT '',
  nagad_number text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable" ON public.app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins update settings" ON public.app_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.app_settings (id) VALUES (1);
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VIP plans
CREATE TABLE public.vip_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 30,
  perks text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_plans TO authenticated;
GRANT ALL ON public.vip_plans TO service_role;
ALTER TABLE public.vip_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans readable" ON public.vip_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage plans" ON public.vip_plans FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.vip_plans (name, price, duration_days, perks) VALUES
 ('Silver', 300, 30, 'All task sections unlocked for 30 days'),
 ('Gold', 700, 60, 'All tasks for 60 days + priority withdraw'),
 ('Diamond', 1500, 120, 'All tasks for 120 days + priority support');

CREATE TABLE public.vip_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES public.vip_plans(id) ON DELETE SET NULL,
  plan_name text NOT NULL DEFAULT '',
  amount numeric NOT NULL,
  method text NOT NULL,
  trx_id text,
  sender_number text,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT ON public.vip_purchases TO authenticated;
GRANT ALL ON public.vip_purchases TO service_role;
ALTER TABLE public.vip_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own vip purchases" ON public.vip_purchases FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.has_active_vip(_uid uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id=_uid AND vip_expires_at > now()); $$;

CREATE OR REPLACE FUNCTION public.grant_vip(_uid uuid, _plan public.vip_plans)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles SET vip_plan_id = _plan.id,
    vip_expires_at = greatest(coalesce(vip_expires_at, now()), now()) + make_interval(days => _plan.duration_days)
  WHERE id = _uid;
END; $$;
REVOKE EXECUTE ON FUNCTION public.grant_vip(uuid, public.vip_plans) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.buy_vip_wallet(_plan_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); pl public.vip_plans; p public.profiles;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT * INTO pl FROM public.vip_plans WHERE id=_plan_id AND is_active;
  IF pl.id IS NULL THEN RAISE EXCEPTION 'Plan not available'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id=uid FOR UPDATE;
  IF p.is_blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  IF p.balance < pl.price THEN RAISE EXCEPTION 'Not enough balance'; END IF;
  UPDATE public.profiles SET balance = balance - pl.price WHERE id=uid;
  INSERT INTO public.vip_purchases (user_id, plan_id, plan_name, amount, method, status, processed_at)
  VALUES (uid, pl.id, pl.name, pl.price, 'wallet', 'approved', now());
  PERFORM public.grant_vip(uid, pl);
END; $$;

CREATE OR REPLACE FUNCTION public.request_vip_manual(_plan_id uuid, _method text, _trx text, _sender text)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); pl public.vip_plans;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _method NOT IN ('bkash','nagad') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;
  IF coalesce(trim(_trx),'') = '' THEN RAISE EXCEPTION 'Transaction ID is required'; END IF;
  SELECT * INTO pl FROM public.vip_plans WHERE id=_plan_id AND is_active;
  IF pl.id IS NULL THEN RAISE EXCEPTION 'Plan not available'; END IF;
  IF EXISTS (SELECT 1 FROM public.vip_purchases WHERE user_id=uid AND status='pending') THEN
    RAISE EXCEPTION 'You already have a pending VIP request'; END IF;
  INSERT INTO public.vip_purchases (user_id, plan_id, plan_name, amount, method, trx_id, sender_number)
  VALUES (uid, pl.id, pl.name, pl.price, _method, trim(_trx), trim(coalesce(_sender,'')));
END; $$;

CREATE OR REPLACE FUNCTION public.review_vip_purchase(_id uuid, _approve boolean)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v public.vip_purchases; pl public.vip_plans;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  SELECT * INTO v FROM public.vip_purchases WHERE id=_id FOR UPDATE;
  IF v.id IS NULL OR v.status <> 'pending' THEN RAISE EXCEPTION 'Request already processed'; END IF;
  UPDATE public.vip_purchases SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END, processed_at=now() WHERE id=_id;
  IF _approve THEN
    SELECT * INTO pl FROM public.vip_plans WHERE id=v.plan_id;
    IF pl.id IS NULL THEN RAISE EXCEPTION 'Plan no longer exists'; END IF;
    PERFORM public.grant_vip(v.user_id, pl);
  END IF;
END; $$;

-- task starts (ad + timer enforcement)
CREATE TABLE public.task_starts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  used boolean NOT NULL DEFAULT false
);
GRANT ALL ON public.task_starts TO service_role;
ALTER TABLE public.task_starts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.start_task(_task_id uuid)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); new_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT public.has_active_vip(uid) THEN RAISE EXCEPTION 'Activate a VIP plan to unlock tasks'; END IF;
  INSERT INTO public.task_starts (user_id, task_id) VALUES (uid, _task_id) RETURNING id INTO new_id;
  RETURN new_id;
END; $$;

-- claim: website tasks only, requires VIP + ad(10s) + timer
CREATE OR REPLACE FUNCTION public.claim_task(_task_id uuid)
 RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE t public.tasks; uid uuid := auth.uid(); done integer; blocked boolean; s public.task_starts;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT is_blocked INTO blocked FROM public.profiles WHERE id = uid;
  IF blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  IF NOT public.has_active_vip(uid) THEN RAISE EXCEPTION 'Activate a VIP plan to unlock tasks'; END IF;
  SELECT * INTO t FROM public.tasks WHERE id = _task_id AND is_active;
  IF t.id IS NULL THEN RAISE EXCEPTION 'Task not available'; END IF;
  IF t.category <> 'website_visit' THEN RAISE EXCEPTION 'This task needs proof submission'; END IF;
  SELECT * INTO s FROM public.task_starts WHERE user_id=uid AND task_id=t.id AND NOT used
    AND started_at > now() - interval '1 hour' ORDER BY started_at DESC LIMIT 1 FOR UPDATE;
  IF s.id IS NULL OR now() - s.started_at < make_interval(secs => 10 + t.duration_seconds - 2) THEN
    RAISE EXCEPTION 'Please watch the ad and finish the timer first'; END IF;
  SELECT count(*) INTO done FROM public.task_completions
   WHERE user_id = uid AND task_id = t.id AND created_at >= date_trunc('day', now());
  IF done >= t.daily_limit THEN RAISE EXCEPTION 'Daily limit reached for this task'; END IF;
  UPDATE public.task_starts SET used = true WHERE id = s.id;
  INSERT INTO public.task_completions (user_id, task_id, title, reward) VALUES (uid, t.id, t.title, t.reward);
  UPDATE public.profiles SET balance = balance + t.reward WHERE id = uid;
  RETURN t.reward;
END; $$;

-- proof submissions
CREATE TABLE public.task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  reward numeric NOT NULL DEFAULT 0,
  proof_text text NOT NULL DEFAULT '',
  proof_path text,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT ON public.task_submissions TO authenticated;
GRANT ALL ON public.task_submissions TO service_role;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own submissions" ON public.task_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.submit_task_proof(_task_id uuid, _proof_text text, _proof_path text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); t public.tasks; blocked boolean; s public.task_starts; done integer; new_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT is_blocked INTO blocked FROM public.profiles WHERE id = uid;
  IF blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  IF NOT public.has_active_vip(uid) THEN RAISE EXCEPTION 'Activate a VIP plan to unlock tasks'; END IF;
  SELECT * INTO t FROM public.tasks WHERE id=_task_id AND is_active;
  IF t.id IS NULL THEN RAISE EXCEPTION 'Task not available'; END IF;
  IF coalesce(trim(_proof_text),'') = '' AND _proof_path IS NULL THEN RAISE EXCEPTION 'Please add proof'; END IF;
  IF _proof_path IS NOT NULL AND split_part(_proof_path,'/',1) <> uid::text THEN RAISE EXCEPTION 'Invalid file'; END IF;
  SELECT * INTO s FROM public.task_starts WHERE user_id=uid AND task_id=t.id AND NOT used
    AND started_at > now() - interval '6 hours' AND started_at < now() - interval '8 seconds'
    ORDER BY started_at DESC LIMIT 1 FOR UPDATE;
  IF s.id IS NULL THEN RAISE EXCEPTION 'Please watch the ad first'; END IF;
  SELECT count(*) INTO done FROM public.task_submissions
   WHERE user_id=uid AND task_id=t.id AND status <> 'rejected' AND created_at >= date_trunc('day', now());
  IF done >= t.daily_limit THEN RAISE EXCEPTION 'Daily limit reached for this task'; END IF;
  UPDATE public.task_starts SET used = true WHERE id = s.id;
  INSERT INTO public.task_submissions (user_id, task_id, title, category, reward, proof_text, proof_path)
  VALUES (uid, t.id, t.title, t.category, t.reward, left(trim(coalesce(_proof_text,'')), 2000), _proof_path)
  RETURNING id INTO new_id;
  RETURN new_id;
END; $$;

CREATE OR REPLACE FUNCTION public.review_task_submission(_id uuid, _approve boolean, _note text DEFAULT NULL)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE s public.task_submissions;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  SELECT * INTO s FROM public.task_submissions WHERE id=_id FOR UPDATE;
  IF s.id IS NULL OR s.status <> 'pending' THEN RAISE EXCEPTION 'Already processed'; END IF;
  UPDATE public.task_submissions SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    note=_note, processed_at=now() WHERE id=_id;
  IF _approve THEN
    INSERT INTO public.task_completions (user_id, task_id, title, reward) VALUES (s.user_id, s.task_id, s.title, s.reward);
    UPDATE public.profiles SET balance = balance + s.reward WHERE id = s.user_id;
  END IF;
END; $$;

-- spins
CREATE TABLE public.spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fee numeric NOT NULL,
  prize numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.spins TO authenticated;
GRANT ALL ON public.spins TO service_role;
ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own spins" ON public.spins FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.play_spin()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); st public.app_settings; p public.profiles; n int; idx int; prize numeric;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT * INTO st FROM public.app_settings WHERE id=1;
  SELECT * INTO p FROM public.profiles WHERE id=uid FOR UPDATE;
  IF p.is_blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  IF p.balance < st.spin_fee THEN RAISE EXCEPTION 'Not enough balance for the entry fee'; END IF;
  n := jsonb_array_length(st.spin_prizes);
  IF n = 0 THEN RAISE EXCEPTION 'Spin is not configured'; END IF;
  idx := floor(random() * n)::int;
  prize := (st.spin_prizes->>idx)::numeric;
  UPDATE public.profiles SET balance = balance - st.spin_fee + prize WHERE id=uid;
  INSERT INTO public.spins (user_id, fee, prize) VALUES (uid, st.spin_fee, prize);
  IF prize > 0 THEN
    INSERT INTO public.task_completions (user_id, title, reward) VALUES (uid, 'Lucky Spin', prize);
  END IF;
  RETURN json_build_object('index', idx, 'prize', prize, 'fee', st.spin_fee);
END; $$;

-- promo codes
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT 0,
  max_uses integer NOT NULL DEFAULT 100,
  used_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promo_codes TO authenticated;
GRANT ALL ON public.promo_codes TO service_role;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage promo" ON public.promo_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.promo_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code_id, user_id)
);
GRANT SELECT ON public.promo_redemptions TO authenticated;
GRANT ALL ON public.promo_redemptions TO service_role;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own redemptions" ON public.promo_redemptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.redeem_code(_code text)
 RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE uid uuid := auth.uid(); c public.promo_codes; blocked boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT is_blocked INTO blocked FROM public.profiles WHERE id = uid;
  IF blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  SELECT * INTO c FROM public.promo_codes WHERE code = upper(trim(_code)) FOR UPDATE;
  IF c.id IS NULL OR NOT c.is_active THEN RAISE EXCEPTION 'Invalid code'; END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at < now() THEN RAISE EXCEPTION 'This code has expired'; END IF;
  IF c.used_count >= c.max_uses THEN RAISE EXCEPTION 'This code is fully used'; END IF;
  IF EXISTS (SELECT 1 FROM public.promo_redemptions WHERE code_id=c.id AND user_id=uid) THEN
    RAISE EXCEPTION 'You already used this code'; END IF;
  INSERT INTO public.promo_redemptions (code_id, user_id, amount) VALUES (c.id, uid, c.amount);
  UPDATE public.promo_codes SET used_count = used_count + 1 WHERE id=c.id;
  UPDATE public.profiles SET balance = balance + c.amount WHERE id=uid;
  INSERT INTO public.task_completions (user_id, title, reward) VALUES (uid, 'Promo code ' || c.code, c.amount);
  RETURN c.amount;
END; $$;

-- support tickets
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  admin_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own tickets" ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "create own tickets" ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'open' AND admin_reply IS NULL);
CREATE POLICY "admins update tickets" ON public.support_tickets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- admin stats extended
CREATE OR REPLACE FUNCTION public.admin_stats()
 RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE result json;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'blocked_users', (SELECT count(*) FROM public.profiles WHERE is_blocked),
    'pending_withdraws', (SELECT count(*) FROM public.withdrawals WHERE status='pending'),
    'pending_amount', (SELECT coalesce(sum(amount),0) FROM public.withdrawals WHERE status='pending'),
    'total_paid', (SELECT coalesce(sum(amount),0) FROM public.withdrawals WHERE status='approved'),
    'total_tasks', (SELECT count(*) FROM public.tasks),
    'vip_users', (SELECT count(*) FROM public.profiles WHERE vip_expires_at > now()),
    'pending_vip', (SELECT count(*) FROM public.vip_purchases WHERE status='pending'),
    'pending_submissions', (SELECT count(*) FROM public.task_submissions WHERE status='pending'),
    'open_tickets', (SELECT count(*) FROM public.support_tickets WHERE status='open')
  ) INTO result;
  RETURN result;
END; $$;

-- storage policies
CREATE POLICY "avatar public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatar own upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatar own update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "proof own upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'proofs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "proof read own or admin" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'proofs' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));

-- seed category tasks
INSERT INTO public.tasks (title, description, kind, category, icon, reward, duration_seconds, daily_limit, instructions) VALUES
 ('Gmail Account Sale','Submit a fresh Gmail account','account','account_sale','gmail',30,0,5,'Create a new Gmail account and submit details + screenshot as proof.'),
 ('Facebook Account Sale','Submit a fresh Facebook account','account','account_sale','facebook',40,0,5,'Create a new Facebook account and submit details + screenshot.'),
 ('WhatsApp Account Sale','Submit a WhatsApp account','account','account_sale','whatsapp',35,0,5,'Submit WhatsApp account info and screenshot.'),
 ('Telegram Account Sale','Submit a Telegram account','account','account_sale','telegram',30,0,5,'Submit Telegram account info and screenshot.'),
 ('Instagram Account Sale','Submit an Instagram account','account','account_sale','instagram',35,0,5,'Submit Instagram account info and screenshot.'),
 ('Neva Coin Sale','Sell Neva Coin','coin','coin_sale','neva',20,0,3,'Transfer coins and submit transaction screenshot.'),
 ('NS Coin Sale','Sell NS Coin','coin','coin_sale','ns',20,0,3,'Transfer coins and submit transaction screenshot.'),
 ('CoinSta Coin Sale','Sell CoinSta Coin','coin','coin_sale','coinsta',25,0,3,'Transfer coins and submit transaction screenshot.'),
 ('Instagram Coin Sale','Sell Instagram Coin','coin','coin_sale','instagram',25,0,3,'Transfer coins and submit transaction screenshot.'),
 ('WhatsApp Bind','Send SMS and bind WhatsApp','whatsapp','whatsapp_bind','whatsapp',50,0,2,'Send the SMS code as instructed, bind WhatsApp, then submit your number + screenshot.');
