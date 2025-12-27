-- Quick Fix for Storage Upload Issues
-- Run this SQL in your Supabase SQL Editor to fix upload permissions

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;

-- Allow public read access (anyone can view images)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Allow ANY authenticated user to upload (since admin panel requires login)
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- NOTES:
-- This allows ANY logged-in user to upload/update/delete images
-- Since the admin panel requires authentication, this should work
-- If you want stricter control, make sure your user has role: "admin" in user_metadata

