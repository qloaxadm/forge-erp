-- Add missing columns to price_lists table
ALTER TABLE price_lists
  ADD COLUMN description TEXT,
  ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN effective_to TIMESTAMP WITH TIME ZONE,
  ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have default values for NOT NULL columns
UPDATE price_lists SET 
  currency = 'USD',
  is_active = TRUE,
  effective_from = NOW(),
  created_at = NOW(),
  updated_at = NOW();
