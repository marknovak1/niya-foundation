-- Add restrictive DELETE policy for profiles table
-- Users can only delete their own profile, admins can delete any profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));