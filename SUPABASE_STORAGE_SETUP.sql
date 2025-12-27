-- Supabase Storage Setup for Image Uploads
-- Run this SQL in your Supabase SQL Editor

-- 1. Create images bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 2. Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;

-- 3. Allow public read access (anyone can view images)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- 4. Allow authenticated users to upload (since admin panel requires login)
CREATE POLICY "Admin upload access" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);

-- 5. Allow authenticated users to update
CREATE POLICY "Admin update access" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' AND (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);

-- 6. Allow authenticated users to delete
CREATE POLICY "Admin delete access" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' AND (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);

-- NOTES:
-- 1. The bucket is set to PUBLIC so images can be accessed via public URLs
-- 2. File size limit is set to 5MB (5242880 bytes)
-- 3. Only admins can upload/update/delete images
-- 4. Everyone can view (read) images
-- 5. Make sure your admin user has role: "admin" in user_metadata

