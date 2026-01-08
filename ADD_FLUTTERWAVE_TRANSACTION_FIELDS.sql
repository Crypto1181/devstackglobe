-- Add Flutterwave transaction tracking fields to consultation_purchases table
-- Run this SQL in your Supabase SQL Editor

-- Add transaction_id and tx_ref columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consultation_purchases' AND column_name='transaction_id') THEN
    ALTER TABLE consultation_purchases ADD COLUMN transaction_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='consultation_purchases' AND column_name='tx_ref') THEN
    ALTER TABLE consultation_purchases ADD COLUMN tx_ref TEXT;
  END IF;
END $$;

-- Create index for faster queries on transaction reference
CREATE INDEX IF NOT EXISTS idx_consultation_purchases_tx_ref ON consultation_purchases(tx_ref);
CREATE INDEX IF NOT EXISTS idx_consultation_purchases_transaction_id ON consultation_purchases(transaction_id);

