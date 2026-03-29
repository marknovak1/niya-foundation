-- Add explicit policy to block public/anonymous read access to profiles
CREATE POLICY "No public read access for profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);