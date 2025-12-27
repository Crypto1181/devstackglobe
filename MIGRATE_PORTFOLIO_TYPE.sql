-- Migration: Remove portfolio type constraint to allow custom types
-- Run this SQL in your Supabase SQL Editor if you already have the portfolio table

-- Remove the CHECK constraint on type column
ALTER TABLE portfolio DROP CONSTRAINT IF EXISTS portfolio_type_check;

-- Verify the constraint is removed
-- You can check by running: SELECT * FROM information_schema.table_constraints WHERE table_name = 'portfolio';

