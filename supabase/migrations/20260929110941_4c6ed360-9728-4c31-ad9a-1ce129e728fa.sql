-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  balance numeric(12,2) NOT NULL DEFAULT 0,
  total_withdrawn numeric(12,2) NOT NULL DEFAULT 0,
  referral_code text NOT NULL UNIQUE,
  referred_by uuid,
  referral_earning numeric(12,2) NOT NULL DEFAULT 0,
  is_blocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own profile" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "update own name" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admins update profiles" ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- protect money columns from direct user edits
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') THEN
    RETURN NEW;
  END IF;
  NEW.balance := OLD.balance;
  NEW.total_withdrawn := OLD.total_withdrawn;
  NEW.referral_earning := OLD.referral_earning;
  NEW.referral_code := OLD.referral_code;
  NEW.referred_by := OLD.referred_by;
  NEW.is_blocked := OLD.is_blocked;
  NEW.email := OLD.email;
  RETURN NEW;
END;
$$;
CREATE TRIGGER protect_profile_columns BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

-- tasks
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'watch_ad',
  reward numeric(12,2) NOT NULL DEFAULT 1,
  link text,
  duration_seconds integer NOT NULL DEFAULT 30,
  daily_limit integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks readable" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage tasks" ON public.tasks FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- completions
CREATE TABLE public.task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  reward numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.task_completions TO authenticated;
GRANT ALL ON public.task_completions TO service_role;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own completions" ON public.task_completions FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX task_completions_user_idx ON public.task_completions (user_id, created_at DESC);

-- withdrawals
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  method text NOT NULL,
  account_number text NOT NULL,
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own withdrawals" ON public.withdrawals FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX withdrawals_status_idx ON public.withdrawals (status, created_at DESC);

-- signup handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  code text;
  ref_code text;
  ref_id uuid;
BEGIN
  code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  ref_code := nullif(trim(coalesce(NEW.raw_user_meta_data->>'referral_code','')),'');
  IF ref_code IS NOT NULL THEN
    SELECT id INTO ref_id FROM public.profiles WHERE referral_code = upper(ref_code);
  END IF;

  INSERT INTO public.profiles (id, email, full_name, referral_code, referred_by)
  VALUES (NEW.id, coalesce(NEW.email,''), coalesce(NEW.raw_user_meta_data->>'full_name',''), code, ref_id);

  IF ref_id IS NOT NULL THEN
    UPDATE public.profiles
      SET balance = balance + 20, referral_earning = referral_earning + 20
      WHERE id = ref_id;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN lower(coalesce(NEW.email,'')) = 'admin@gmail.com' THEN 'admin'::public.app_role ELSE 'user'::public.app_role END)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- claim a task reward
CREATE OR REPLACE FUNCTION public.claim_task(_task_id uuid)
RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  t public.tasks;
  uid uuid := auth.uid();
  done integer;
  blocked boolean;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT is_blocked INTO blocked FROM public.profiles WHERE id = uid;
  IF blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;

  SELECT * INTO t FROM public.tasks WHERE id = _task_id AND is_active;
  IF t.id IS NULL THEN RAISE EXCEPTION 'Task not available'; END IF;

  SELECT count(*) INTO done FROM public.task_completions
   WHERE user_id = uid AND task_id = t.id AND created_at >= date_trunc('day', now());
  IF done >= t.daily_limit THEN RAISE EXCEPTION 'Daily limit reached for this task'; END IF;

  INSERT INTO public.task_completions (user_id, task_id, title, reward)
  VALUES (uid, t.id, t.title, t.reward);
  UPDATE public.profiles SET balance = balance + t.reward WHERE id = uid;
  RETURN t.reward;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_task(uuid) TO authenticated;

-- request withdrawal
CREATE OR REPLACE FUNCTION public.request_withdrawal(_method text, _account text, _amount numeric)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  p public.profiles;
  new_id uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF _method NOT IN ('bkash','nagad') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;
  IF _amount < 100 THEN RAISE EXCEPTION 'Minimum withdraw amount is 100 Taka'; END IF;
  IF coalesce(trim(_account),'') = '' THEN RAISE EXCEPTION 'Account number is required'; END IF;

  SELECT * INTO p FROM public.profiles WHERE id = uid FOR UPDATE;
  IF p.is_blocked THEN RAISE EXCEPTION 'Your account is blocked'; END IF;
  IF p.balance < _amount THEN RAISE EXCEPTION 'Not enough balance'; END IF;

  UPDATE public.profiles SET balance = balance - _amount WHERE id = uid;
  INSERT INTO public.withdrawals (user_id, method, account_number, amount)
  VALUES (uid, _method, trim(_account), _amount)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(text,text,numeric) TO authenticated;

-- admin decision
CREATE OR REPLACE FUNCTION public.review_withdrawal(_id uuid, _approve boolean, _note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE w public.withdrawals;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  SELECT * INTO w FROM public.withdrawals WHERE id = _id FOR UPDATE;
  IF w.id IS NULL OR w.status <> 'pending' THEN RAISE EXCEPTION 'Request already processed'; END IF;

  IF _approve THEN
    UPDATE public.withdrawals SET status='approved', note=_note, processed_at=now() WHERE id=_id;
    UPDATE public.profiles SET total_withdrawn = total_withdrawn + w.amount WHERE id = w.user_id;
  ELSE
    UPDATE public.withdrawals SET status='rejected', note=_note, processed_at=now() WHERE id=_id;
    UPDATE public.profiles SET balance = balance + w.amount WHERE id = w.user_id;
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.review_withdrawal(uuid,boolean,text) TO authenticated;

-- today's earning helper
CREATE OR REPLACE FUNCTION public.today_earning()
RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(sum(reward),0) FROM public.task_completions
  WHERE user_id = auth.uid() AND created_at >= date_trunc('day', now());
$$;
GRANT EXECUTE ON FUNCTION public.today_earning() TO authenticated;

-- admin stats
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result json;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not allowed'; END IF;
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'blocked_users', (SELECT count(*) FROM public.profiles WHERE is_blocked),
    'pending_withdraws', (SELECT count(*) FROM public.withdrawals WHERE status='pending'),
    'pending_amount', (SELECT coalesce(sum(amount),0) FROM public.withdrawals WHERE status='pending'),
    'total_paid', (SELECT coalesce(sum(amount),0) FROM public.withdrawals WHERE status='approved'),
    'total_tasks', (SELECT count(*) FROM public.tasks)
  ) INTO result;
  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;

INSERT INTO public.tasks (title, description, kind, reward, link, duration_seconds, daily_limit) VALUES
('Watch Ad','Watch a short sponsored video for 30 seconds.','watch_ad',5,NULL,30,10),
('Visit Website','Open our partner website and stay for 30 seconds.','visit_website',8,'https://example.com',30,5),
('Daily Spin','Spin once every day for a bonus reward.','daily_spin',12,NULL,30,1);