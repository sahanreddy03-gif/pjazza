-- PJAZZA Storage bucket for stream videos
-- Run in Supabase SQL Editor after 002_seed_data.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stream-videos',
  'stream-videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read stream-videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'stream-videos');

-- Allow anonymous upload (for demo; restrict when auth is added)
CREATE POLICY "Public upload stream-videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stream-videos');

-- Allow update/delete for demo
CREATE POLICY "Public update stream-videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'stream-videos');

CREATE POLICY "Public delete stream-videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'stream-videos');

-- Allow anonymous insert into streams (for demo; remove when auth is added)
CREATE POLICY "Allow insert streams for demo" ON public.streams
FOR INSERT WITH CHECK (true);
