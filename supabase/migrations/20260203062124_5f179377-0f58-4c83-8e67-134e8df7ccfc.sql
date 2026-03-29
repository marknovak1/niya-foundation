-- Contact Form Submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  newsletter_optin BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- No public read access (admin only via dashboard)
CREATE POLICY "No public read access for contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (false);

-- Newsletter Subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscriber_type TEXT DEFAULT 'general',
  interests TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- No public read access
CREATE POLICY "No public read for newsletter"
  ON public.newsletter_subscriptions
  FOR SELECT
  USING (false);

-- Membership Registrations
CREATE TABLE public.membership_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  membership_tier TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  organization TEXT,
  how_heard TEXT,
  interests TEXT[] DEFAULT '{}',
  newsletter_optin BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can register for membership
CREATE POLICY "Anyone can register for membership"
  ON public.membership_registrations
  FOR INSERT
  WITH CHECK (true);

-- No public read access
CREATE POLICY "No public read for memberships"
  ON public.membership_registrations
  FOR SELECT
  USING (false);

-- Survey Responses
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_type TEXT NOT NULL,
  respondent_name TEXT,
  respondent_email TEXT,
  responses JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can submit survey
CREATE POLICY "Anyone can submit survey"
  ON public.survey_responses
  FOR INSERT
  WITH CHECK (true);

-- No public read access
CREATE POLICY "No public read for surveys"
  ON public.survey_responses
  FOR SELECT
  USING (false);