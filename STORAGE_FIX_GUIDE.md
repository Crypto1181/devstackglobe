# 🔧 Fix Storage Upload Error - Row Level Security

## Quick Fix

Run this SQL in your Supabase SQL Editor:

```sql
-- Run FIX_STORAGE_UPLOAD.sql file
```

Or copy this quick fix:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Allow ANY authenticated user to upload
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated update access" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete access" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' AND auth.role() = 'authenticated'
);
```

## Step-by-Step Fix

### Step 1: Create Storage Bucket (if not exists)

1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `images`
4. ✅ Check **Public bucket**
5. Click **Create**

### Step 2: Run the Fix SQL

1. Go to **SQL Editor**
2. Open `FIX_STORAGE_UPLOAD.sql`
3. Copy and paste the SQL
4. Click **Run**

### Step 3: Verify

1. Refresh your admin panel
2. Try uploading an image again
3. Check browser console (F12) if it still fails

## Common Issues

### Issue: "Bucket not found"
**Solution**: Make sure you created the `images` bucket in Storage

### Issue: "new row violates row-level security policy"
**Solution**: Run the `FIX_STORAGE_UPLOAD.sql` file - this sets up the correct policies

### Issue: "Permission denied"
**Solution**: 
- Make sure you're logged in
- Check that the bucket exists
- Verify policies are created (check Storage → Policies)

### Issue: Still not working
**Solution**: 
1. Check browser console (F12) for detailed error
2. Verify bucket is set to **Public**
3. Make sure you're logged in with `admin1181@gmail.com`
4. Try using the URL option instead of file upload as a workaround

## Alternative: Use Image URLs

If upload still doesn't work, you can:
1. Upload images to a service like Imgur, Cloudinary, or your own server
2. Copy the image URL
3. Paste it in the "Or paste image URL here" field

This bypasses Supabase Storage entirely.

