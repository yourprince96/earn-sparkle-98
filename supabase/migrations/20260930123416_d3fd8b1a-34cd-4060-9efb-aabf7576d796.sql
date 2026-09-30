CREATE TABLE public.fraud_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewed_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  reviewed_label TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'activity',
  risk_level TEXT NOT NULL DEFAULT 'normal',
  risk_score INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_action TEXT NOT NULL DEFAULT '',
  activity_input TEXT NOT NULL DEFAULT '',
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fraud_reviews TO authenticated;
GRANT ALL ON public.fraud_reviews TO service_role;

ALTER TABLE public.fraud_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read fraud reviews"
  ON public.fraud_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create fraud reviews"
  ON public.fraud_reviews FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update fraud reviews"
  ON public.fraud_reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete fraud reviews"
  ON public.fraud_reviews FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX fraud_reviews_created_at_idx ON public.fraud_reviews (created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_fraud_reviews_updated_at
  BEFORE UPDATE ON public.fraud_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();