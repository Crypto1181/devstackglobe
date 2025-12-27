# Supabase Storage Setup for Image Uploads

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ **Check this** (so images are publicly accessible)
   - **File size limit**: 5MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or leave empty for all)
5. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies so admins can upload and everyone can view:

1. Go to **Storage** → **Policies** → Select `images` bucket
2. Click **New Policy**
3. Create these policies:

### Policy 1: Anyone can view images (SELECT)
- **Policy name**: `Public read access`
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
true
```

### Policy 2: Only admins can upload (INSERT)
- **Policy name**: `Admin upload access`
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
auth.jwt() ->> 'role' = 'admin' OR
(auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
```

### Policy 3: Only admins can update (UPDATE)
- **Policy name**: `Admin update access`
- **Allowed operation**: UPDATE
- **Policy definition**:
```sql
auth.jwt() ->> 'role' = 'admin' OR
(auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
```

### Policy 4: Only admins can delete (DELETE)
- **Policy name**: `Admin delete access`
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
auth.jwt() ->> 'role' = 'admin' OR
(auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
```

## Alternative: Quick SQL Setup

You can also run this SQL in the SQL Editor to set up policies quickly:

```sql
-- Create bucket if it doesn't exist (run this in SQL Editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Allow admin upload
CREATE POLICY "Admin upload access" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);

-- Allow admin update
CREATE POLICY "Admin update access" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' AND (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);

-- Allow admin delete
CREATE POLICY "Admin delete access" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' AND (
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  )
);
```

## Step 3: Test Upload

1. Open your admin panel (`admin-panel.html`)
2. Try uploading an image in any section
3. You should see "Uploading..." then "Uploaded!" message
4. The image preview should appear

## Troubleshooting

### "Bucket not found" error
- Make sure you created the `images` bucket
- Check that the bucket name is exactly `images` (lowercase)

### "Permission denied" error
- Make sure you set up the storage policies
- Verify your user has admin role in user metadata
- Check that the bucket is set to public

### Upload works but image doesn't show
- Check browser console for CORS errors
- Verify the bucket is set to **Public**
- Check the image URL in the database

## File Size Limits

By default, Supabase allows files up to 50MB. You can adjust this in:
- **Storage** → **Settings** → **File size limit**

For images, 5-10MB is usually sufficient.

