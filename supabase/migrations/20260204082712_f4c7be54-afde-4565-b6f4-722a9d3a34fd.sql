-- Add translation columns for all supported languages to news_articles
ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS title_es text,
ADD COLUMN IF NOT EXISTS title_ar text,
ADD COLUMN IF NOT EXISTS title_ru text,
ADD COLUMN IF NOT EXISTS title_zh text,
ADD COLUMN IF NOT EXISTS excerpt_es text,
ADD COLUMN IF NOT EXISTS excerpt_ar text,
ADD COLUMN IF NOT EXISTS excerpt_ru text,
ADD COLUMN IF NOT EXISTS excerpt_zh text,
ADD COLUMN IF NOT EXISTS content_es text,
ADD COLUMN IF NOT EXISTS content_ar text,
ADD COLUMN IF NOT EXISTS content_ru text,
ADD COLUMN IF NOT EXISTS content_zh text;

-- Add same columns to events table for consistency
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS description_es text,
ADD COLUMN IF NOT EXISTS description_ar text,
ADD COLUMN IF NOT EXISTS description_ru text,
ADD COLUMN IF NOT EXISTS description_zh text,
ADD COLUMN IF NOT EXISTS title_es text,
ADD COLUMN IF NOT EXISTS title_ar text,
ADD COLUMN IF NOT EXISTS title_ru text,
ADD COLUMN IF NOT EXISTS title_zh text;