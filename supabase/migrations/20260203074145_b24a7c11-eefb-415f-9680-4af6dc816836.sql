-- Add restrictive UPDATE policy for contact_submissions
-- Only admins can update submissions (e.g., to change status)
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add restrictive DELETE policy for contact_submissions
-- Only admins can delete submissions
CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));