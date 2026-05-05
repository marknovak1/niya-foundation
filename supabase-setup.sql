-- ============================================================
-- NIYA FOUNDATION — Full Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- 1. ENUMS
-- ============================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TYPE public.contact_segment AS ENUM (
  'donor', 'member', 'partner', 'volunteer', 'subscriber', 'other'
);

CREATE TYPE public.donor_tier AS ENUM (
  'platinum', 'gold', 'silver', 'bronze', 'supporter'
);


-- ============================================================
-- 2. TABLES
-- ============================================================

-- Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- User Roles (admin / moderator / user)
CREATE TABLE public.user_roles (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text NOT NULL,
  email            text NOT NULL,
  phone            text,
  subject          text NOT NULL,
  inquiry_type     text NOT NULL,
  message          text NOT NULL,
  newsletter_optin boolean DEFAULT false,
  status           text DEFAULT 'new',
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- Newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email            text NOT NULL UNIQUE,
  name             text,
  interests        text[],
  is_active        boolean DEFAULT true,
  segment          public.contact_segment,
  subscriber_type  text,
  unsubscribed_at  timestamptz,
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- Membership registrations
CREATE TABLE public.membership_registrations (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name       text NOT NULL,
  last_name        text NOT NULL,
  email            text NOT NULL,
  phone            text,
  organization     text,
  address          text,
  city             text,
  postal_code      text,
  country          text,
  membership_tier  text NOT NULL,
  interests        text[],
  how_heard        text,
  newsletter_optin boolean DEFAULT false,
  status           text DEFAULT 'pending',
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- Events
CREATE TABLE public.events (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  title_fr         text,
  title_es         text,
  title_ar         text,
  title_zh         text,
  title_ru         text,
  description      text,
  description_fr   text,
  description_es   text,
  description_ar   text,
  description_zh   text,
  description_ru   text,
  event_date       timestamptz NOT NULL,
  end_date         timestamptz,
  location         text,
  location_url     text,
  image_url        text,
  max_attendees    integer,
  registration_url text,
  is_published     boolean DEFAULT false,
  is_campaign      boolean DEFAULT false,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  notes      text,
  status     text DEFAULT 'registered',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- News articles
CREATE TABLE public.news_articles (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  title_fr     text,
  title_es     text,
  title_ar     text,
  title_zh     text,
  title_ru     text,
  excerpt      text NOT NULL,
  excerpt_fr   text,
  excerpt_es   text,
  excerpt_ar   text,
  excerpt_zh   text,
  excerpt_ru   text,
  content      text,
  content_fr   text,
  content_es   text,
  content_ar   text,
  content_zh   text,
  content_ru   text,
  author       text DEFAULT 'Niya Foundation',
  category     text DEFAULT 'general',
  image_url    text,
  is_published boolean DEFAULT false,
  is_featured  boolean DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

-- Survey responses
CREATE TABLE public.survey_responses (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_type      text NOT NULL,
  respondent_name  text,
  respondent_email text,
  responses        jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- Training documents
CREATE TABLE public.training_documents (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  description      text,
  category         text DEFAULT 'general',
  file_url         text NOT NULL,
  file_type        text,
  file_size_bytes  bigint,
  is_published     boolean DEFAULT false,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

-- Business listings
CREATE TABLE public.business_listings (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  category      text DEFAULT 'general',
  description   text,
  location      text,
  contact_email text,
  contact_phone text,
  image_url     text,
  price         text,
  is_published  boolean DEFAULT false,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

-- Recognized donors / partners
CREATE TABLE public.recognized_donors (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  tier          public.donor_tier DEFAULT 'supporter',
  logo_url      text,
  website_url   text,
  is_visible    boolean DEFAULT true,
  is_partner    boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

-- Rate limiting
CREATE TABLE public.rate_limits (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  form_type  text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);


-- ============================================================
-- 3. FUNCTIONS
-- ============================================================

-- Check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Rate limiting check
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_form_type      text,
  p_identifier     text,
  p_max_requests   integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND form_type  = p_form_type
    AND created_at > now() - (p_window_minutes || ' minutes')::interval;

  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  INSERT INTO public.rate_limits (identifier, form_type)
  VALUES (p_identifier, p_form_type);

  RETURN true;
END;
$$;

-- Cleanup old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '24 hours';
$$;

-- Auto-assign first registered user as admin
CREATE OR REPLACE FUNCTION public.try_assign_first_admin(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.user_roles WHERE role = 'admin';

  IF v_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, 'admin')
    ON CONFLICT DO NOTHING;
    RETURN jsonb_build_object('assigned', true);
  END IF;

  RETURN jsonb_build_object('assigned', false);
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger: create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_documents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_listings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recognized_donors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits             ENABLE ROW LEVEL SECURITY;

-- PROFILES: users can read/update their own profile; admins can read all
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role('admin', auth.uid()));

-- USER ROLES: only admins can manage
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- CONTACT SUBMISSIONS: anyone can insert; only admins can read/update
CREATE POLICY "Public can submit contact"     ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contacts"      ON public.contact_submissions FOR SELECT USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Admins can update contacts"    ON public.contact_submissions FOR UPDATE USING (public.has_role('admin', auth.uid()));

-- NEWSLETTER: anyone can subscribe; admins can manage all
CREATE POLICY "Public can subscribe"          ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can unsubscribe"        ON public.newsletter_subscriptions FOR UPDATE USING (true);
CREATE POLICY "Admins manage newsletters"     ON public.newsletter_subscriptions FOR ALL USING (public.has_role('admin', auth.uid()));

-- MEMBERSHIP: anyone can register; admins can manage all
CREATE POLICY "Public can register membership" ON public.membership_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage memberships"      ON public.membership_registrations FOR ALL USING (public.has_role('admin', auth.uid()));

-- EVENTS: published events are public; admins manage all
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage events"             ON public.events FOR ALL USING (public.has_role('admin', auth.uid()));

-- EVENT REGISTRATIONS: anyone can register; members can view own; admins manage all
CREATE POLICY "Public can register for events"   ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Members view own registrations"   ON public.event_registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND email = event_registrations.email)
);
CREATE POLICY "Admins manage event registrations" ON public.event_registrations FOR ALL USING (public.has_role('admin', auth.uid()));

-- NEWS: published articles are public; admins manage all
CREATE POLICY "Public can view published news" ON public.news_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage news"             ON public.news_articles FOR ALL USING (public.has_role('admin', auth.uid()));

-- SURVEY RESPONSES: anyone can submit; admins manage all
CREATE POLICY "Public can submit surveys"  ON public.survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage surveys"      ON public.survey_responses FOR ALL USING (public.has_role('admin', auth.uid()));

-- TRAINING DOCUMENTS: published docs public; admins manage all
CREATE POLICY "Public can view published docs" ON public.training_documents FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage training docs"    ON public.training_documents FOR ALL USING (public.has_role('admin', auth.uid()));

-- BUSINESS LISTINGS: published listings public; admins manage all
CREATE POLICY "Public can view published listings" ON public.business_listings FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage listings"             ON public.business_listings FOR ALL USING (public.has_role('admin', auth.uid()));

-- RECOGNIZED DONORS: visible donors are public; admins manage all
CREATE POLICY "Public can view visible donors" ON public.recognized_donors FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins manage donors"           ON public.recognized_donors FOR ALL USING (public.has_role('admin', auth.uid()));

-- RATE LIMITS: anyone can insert (used by forms); admins can view
CREATE POLICY "Public can insert rate limits" ON public.rate_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view rate limits"   ON public.rate_limits FOR SELECT USING (public.has_role('admin', auth.uid()));


-- ============================================================
-- DONE! Next steps are in the setup guide.
-- ============================================================
