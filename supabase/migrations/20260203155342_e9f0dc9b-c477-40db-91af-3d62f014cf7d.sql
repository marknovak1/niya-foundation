-- Add moderator access to content management tables

-- News articles: moderators can manage
DROP POLICY IF EXISTS "Admins can manage news" ON public.news_articles;
CREATE POLICY "Admins and moderators can manage news" 
ON public.news_articles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Events: moderators can manage
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins and moderators can manage events" 
ON public.events 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Recognized donors: moderators can manage
DROP POLICY IF EXISTS "Admins can manage donors" ON public.recognized_donors;
CREATE POLICY "Admins and moderators can manage donors" 
ON public.recognized_donors 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Event registrations: moderators can view and manage
DROP POLICY IF EXISTS "Admins can manage registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view registrations" ON public.event_registrations;
CREATE POLICY "Admins and moderators can manage registrations" 
ON public.event_registrations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Contact submissions: moderators can view and update (not delete)
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins and moderators can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Admins and moderators can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Membership registrations: moderators can view
DROP POLICY IF EXISTS "Admins can view membership registrations" ON public.membership_registrations;
CREATE POLICY "Admins and moderators can view membership registrations" 
ON public.membership_registrations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Newsletter subscriptions: moderators can view
DROP POLICY IF EXISTS "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins and moderators can view newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Survey responses: moderators can view
DROP POLICY IF EXISTS "Admins can view survey responses" ON public.survey_responses;
CREATE POLICY "Admins and moderators can view survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Profiles: moderators can view all profiles (for user management display)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins and moderators can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));