-- Try adding columns one by one to see which ones are problematic

-- First try with a simple 'name' column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Display the table structure after adding name
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try adding email
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Display the table structure after adding email
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try adding password
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pass TEXT;

-- Display the table structure after adding password
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try adding role
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'user';

-- Display the final table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 