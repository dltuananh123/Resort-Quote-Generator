-- Create the quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL DEFAULT 0,
  room_type TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL,
  additional_fees NUMERIC DEFAULT 0,
  notes TEXT,
  booking_id TEXT,
  children_details TEXT,
  special_requests TEXT,
  additional_services TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Set up RLS (Row Level Security)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to see only their quotes
CREATE POLICY "Users can view own quotes" 
ON quotes FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert their own quotes
CREATE POLICY "Users can insert own quotes" 
ON quotes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to update their own quotes
CREATE POLICY "Users can update own quotes" 
ON quotes FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own quotes
CREATE POLICY "Users can delete own quotes" 
ON quotes FOR DELETE 
USING (auth.uid() = user_id); 