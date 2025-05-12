-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

-- Add comment for the table
COMMENT ON TABLE public.users IS 'Table for storing user information for the Resort Quote Generator app';

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);

-- Insert initial admin user
INSERT INTO public.users (id, name, email, password, role)
VALUES (
  'd6b89f6c-e0de-4d6a-8a2d-91e2a7fe3e5c',
  'Admin',
  'admin@asteria.com',
  'password123',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert initial staff user
INSERT INTO public.users (id, name, email, password, role)
VALUES (
  'a2c7c8d9-e0f1-4g2h-3i4j-5k6l7m8n9o0p',
  'Staff Member',
  'staff@asteria.com',
  'password123',
  'user'
) ON CONFLICT (email) DO NOTHING; 