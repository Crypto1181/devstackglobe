-- Fix Row Level Security Policies for Database Tables
-- This fixes 403 Forbidden errors when creating/updating/deleting items
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- PORTFOLIO TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can update portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can update portfolio" ON portfolio;
DROP POLICY IF EXISTS "Only admins can delete portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio" ON portfolio;

-- Allow anyone to view
CREATE POLICY "Anyone can view portfolio" ON portfolio
  FOR SELECT USING (true);

-- Allow authenticated users to insert (since admin panel requires login)
CREATE POLICY "Authenticated users can insert portfolio" ON portfolio
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update portfolio" ON portfolio
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete portfolio" ON portfolio
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ============================================
-- TEMPLATES TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view templates" ON templates;
DROP POLICY IF EXISTS "Only admins can insert templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON templates;
DROP POLICY IF EXISTS "Only admins can update templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can update templates" ON templates;
DROP POLICY IF EXISTS "Only admins can delete templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can delete templates" ON templates;

-- Allow anyone to view
CREATE POLICY "Anyone can view templates" ON templates
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert templates" ON templates
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update templates" ON templates
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete templates" ON templates
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ============================================
-- MARKETPLACE TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can insert marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can insert marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can update marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can update marketplace" ON marketplace;
DROP POLICY IF EXISTS "Only admins can delete marketplace" ON marketplace;
DROP POLICY IF EXISTS "Authenticated users can delete marketplace" ON marketplace;

-- Allow anyone to view
CREATE POLICY "Anyone can view marketplace" ON marketplace
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert marketplace" ON marketplace
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update marketplace" ON marketplace
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete marketplace" ON marketplace
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- NOTES:
-- These policies allow ANY authenticated user to insert/update/delete
-- Since the admin panel requires login, this should work
-- If you want stricter control, you can add admin checks later

