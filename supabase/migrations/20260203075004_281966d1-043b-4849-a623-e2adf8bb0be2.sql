-- Create donor tier enum
CREATE TYPE public.donor_tier AS ENUM ('platinum', 'gold', 'silver', 'bronze', 'supporter');

-- Create recognized donors/partners table
CREATE TABLE public.recognized_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier donor_tier NOT NULL DEFAULT 'supporter',
  logo_url TEXT,
  website_url TEXT,
  is_partner BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recognized_donors ENABLE ROW LEVEL SECURITY;

-- Public can view visible donors
CREATE POLICY "Anyone can view visible donors"
  ON public.recognized_donors FOR SELECT
  USING (is_visible = true);

-- Admins can manage donors
CREATE POLICY "Admins can manage donors"
  ON public.recognized_donors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact segments enum
CREATE TYPE public.contact_segment AS ENUM ('donor', 'member', 'partner', 'volunteer', 'subscriber', 'other');

-- Add segment column to newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions 
ADD COLUMN segment contact_segment DEFAULT 'subscriber';

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_fr TEXT,
  description TEXT,
  description_fr TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  location_url TEXT,
  image_url TEXT,
  is_campaign BOOLEAN DEFAULT false,
  registration_url TEXT,
  max_attendees INT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can view published events
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (is_published = true);

-- Admins can manage events
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on event registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can register for events
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (true);

-- Admins can view registrations
CREATE POLICY "Admins can view registrations"
  ON public.event_registrations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- No public read for registrations
CREATE POLICY "No public read for registrations"
  ON public.event_registrations FOR SELECT
  USING (false);

-- Admins can manage registrations
CREATE POLICY "Admins can manage registrations"
  ON public.event_registrations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_recognized_donors_updated_at
  BEFORE UPDATE ON public.recognized_donors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();