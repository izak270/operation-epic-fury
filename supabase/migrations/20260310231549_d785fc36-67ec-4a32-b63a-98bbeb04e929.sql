
CREATE TABLE public.data_research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  country text NOT NULL,
  current_value text,
  previous_value text,
  change_description text,
  source text,
  confidence text DEFAULT 'medium',
  raw_response text,
  batch_id uuid NOT NULL
);

ALTER TABLE public.data_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage research data"
ON public.data_research
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
