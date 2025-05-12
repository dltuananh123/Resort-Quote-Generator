-- Drop the table if it exists
DROP TABLE IF EXISTS public.users;

-- Create users table with carefully chosen column names
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  pass TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'user'
);

-- Add comment for the table
COMMENT ON TABLE public.users IS 'Table for storing user information for the Resort Quote Generator app';

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (user_role);

-- Insert initial admin user
INSERT INTO public.users (id, full_name, email, pass, user_role)
VALUES (
  '51b89f6c-e0de-4d6a-8a2d-91e2a7fe3e5c',
  'Admin',
  'admin@asteria.com',
  'password123',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert initial staff user
INSERT INTO public.users (id, full_name, email, pass, user_role)
VALUES (
  'a2b7c8d9-e0f1-42a2-83b4-5a6b7c8d9e0f',
  'Staff Member',
  'staff@asteria.com',
  'password123',
  'user'
) ON CONFLICT (email) DO NOTHING;

-- Display the table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 