-- Drop old admin policies that depend on profiles.role
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can view membership registrations" ON public.membership_registrations;
DROP POLICY IF EXISTS "Admins can view survey responses" ON public.survey_responses;

-- Remove role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Create new admin policies using secure has_role function
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view newsletter subscriptions"
ON public.newsletter_subscriptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view membership registrations"
ON public.membership_registrations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view survey responses"
ON public.survey_responses FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));