-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

-- Deny all public SELECT access
CREATE POLICY "No public read for rate limits"
  ON public.rate_limits
  FOR SELECT
  USING (false);

-- Deny all public INSERT access (only service role via edge functions)
CREATE POLICY "No public insert for rate limits"
  ON public.rate_limits
  FOR INSERT
  WITH CHECK (false);

-- Deny all public UPDATE access
CREATE POLICY "No public update for rate limits"
  ON public.rate_limits
  FOR UPDATE
  USING (false);

-- Deny all public DELETE access
CREATE POLICY "No public delete for rate limits"
  ON public.rate_limits
  FOR DELETE
  USING (false);