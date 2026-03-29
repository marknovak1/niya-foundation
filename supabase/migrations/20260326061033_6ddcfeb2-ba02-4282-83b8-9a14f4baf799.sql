
-- Training documents table
CREATE TABLE public.training_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  file_size_bytes BIGINT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Business listings table
CREATE TABLE public.business_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  location TEXT,
  price TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.training_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_listings ENABLE ROW LEVEL SECURITY;

-- Training documents: only authenticated users can view published docs
CREATE POLICY "Authenticated users can view published training docs"
  ON public.training_documents FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins and moderators can manage training docs"
  ON public.training_documents FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Business listings: only authenticated users can view published listings
CREATE POLICY "Authenticated users can view published business listings"
  ON public.business_listings FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins and moderators can manage business listings"
  ON public.business_listings FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Create storage bucket for training documents
INSERT INTO storage.buckets (id, name, public) VALUES ('training-documents', 'training-documents', false);

-- Storage RLS: authenticated users can read, admins can upload
CREATE POLICY "Authenticated users can read training docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'training-documents');

CREATE POLICY "Admins can upload training docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'training-documents' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')));

CREATE POLICY "Admins can delete training docs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'training-documents' AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')));
