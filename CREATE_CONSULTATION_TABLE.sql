-- Create consultation_purchases table to track paid consultations
CREATE TABLE IF NOT EXISTS consultation_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE consultation_purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own consultation purchases" ON consultation_purchases;
DROP POLICY IF EXISTS "Users can insert their own consultation purchases" ON consultation_purchases;

-- Create policies
CREATE POLICY "Users can view their own consultation purchases"
  ON consultation_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultation purchases"
  ON consultation_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consultation_purchases_user_id ON consultation_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_purchases_status ON consultation_purchases(status);

