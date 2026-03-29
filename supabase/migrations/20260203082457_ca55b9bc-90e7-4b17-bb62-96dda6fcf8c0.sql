-- Add explicit restrictive policies for user_roles table to prevent write operations
-- Role assignment should only be managed through edge functions with service role

-- Prevent public INSERT (only edge functions with service role should manage roles)
CREATE POLICY "No public insert for user roles"
ON public.user_roles FOR INSERT
WITH CHECK (false);

-- Prevent public UPDATE
CREATE POLICY "No public update for user roles"
ON public.user_roles FOR UPDATE
USING (false);

-- Prevent public DELETE
CREATE POLICY "No public delete for user roles"
ON public.user_roles FOR DELETE
USING (false);