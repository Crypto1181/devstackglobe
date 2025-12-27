-- Supabase Database Schema for DevStackGlobe Admin Panel
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create Portfolio Table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  programming_language TEXT NOT NULL,
  live_demo_url TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add live_demo_url column if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio' AND column_name='live_demo_url') THEN
    ALTER TABLE portfolio ADD COLUMN live_demo_url TEXT;
  END IF;
END $$;

-- Remove type constraint if it exists (to allow custom types)
DO $$ 
BEGIN
  -- Remove the CHECK constraint on type column to allow any text value
  ALTER TABLE portfolio DROP CONSTRAINT IF EXISTS portfolio_type_check;
END $$;

-- 2. Create Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  programming_language TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  review DECIMAL(3, 1) CHECK (review >= 0 AND review <= 5),
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add images and reviews columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='images') THEN
    ALTER TABLE templates ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='reviews') THEN
    ALTER TABLE templates ADD COLUMN reviews JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- 3. Create Marketplace Table
CREATE TABLE IF NOT EXISTS marketplace (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  review DECIMAL(3, 1) CHECK (review >= 0 AND review <= 5),
  type TEXT NOT NULL CHECK (type IN ('plugin', 'api', 'vps', 'server')),
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add images and reviews columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace' AND column_name='images') THEN
    ALTER TABLE marketplace ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace' AND column_name='reviews') THEN
    ALTER TABLE marketplace ADD COLUMN reviews JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Anyone can view portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can update portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can update portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can delete portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio" ON portfolio;

DROP POLICY IF EXISTS "Anyone can view templates" ON templates;
DROP POLICY IF EXISTS "Only admins can insert templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON templates;
DROP POLICY IF EXISTS "Only admins can update templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can update templates" ON templates;
DROP POLICY IF EXISTS "Only admins can delete templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can delete templates" ON templates;

DROP POLICY IF EXISTS "Anyone can view marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can insert marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can insert marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can update marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can update marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can delete marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can delete marketplace" ON marketplace;

-- 6. Create Policies for Portfolio (Allow all authenticated users to read, authenticated users to write)
CREATE POLICY "Anyone can view portfolio" ON portfolio
  FOR SELECT USING (true);

-- Allow authenticated users to insert (since admin panel requires login)
CREATE POLICY "Authenticated users can insert portfolio" ON portfolio
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update portfolio" ON portfolio
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete portfolio" ON portfolio
  FOR DELETE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- 7. Create Policies for Templates
CREATE POLICY "Anyone can view templates" ON templates
  FOR SELECT USING (true);

-- Allow authenticated users to insert (since admin panel requires login)
CREATE POLICY "Authenticated users can insert templates" ON templates
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update templates" ON templates
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete templates" ON templates
  FOR DELETE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- 8. Create Policies for Marketplace
CREATE POLICY "Anyone can view marketplace" ON marketplace
  FOR SELECT USING (true);

-- Allow authenticated users to insert (since admin panel requires login)
CREATE POLICY "Authenticated users can insert marketplace" ON marketplace
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update marketplace" ON marketplace
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete marketplace" ON marketplace
  FOR DELETE USING (
    auth.role() = 'authenticated' OR
    auth.jwt() ->> 'role' = 'admin' OR
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Drop existing triggers if they exist (to avoid errors on re-run)
DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio;
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
DROP TRIGGER IF EXISTS update_marketplace_updated_at ON marketplace;

-- 10. Create triggers to auto-update updated_at
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON marketplace
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. (Optional) Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_type ON portfolio(type);
CREATE INDEX IF NOT EXISTS idx_templates_programming_language ON templates(programming_language);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace(type);

-- NOTES:
-- 1. To make a user an admin, update their user metadata in Supabase:
--    - Go to Authentication > Users
--    - Edit the user
--    - Add to user_metadata: { "role": "admin" } or { "is_admin": true }
--
-- 2. Alternatively, you can create an admin_users table:
--    CREATE TABLE admin_users (user_id UUID PRIMARY KEY REFERENCES auth.users(id));
--    Then update the policies to check this table instead
--
-- 3. For initial testing, you can temporarily disable RLS:
--    ALTER TABLE portfolio DISABLE ROW LEVEL SECURITY;
--    (Remember to re-enable it after testing!)

