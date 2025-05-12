# Supabase Database Setup Guide

This directory contains SQL files for setting up the database for the Resort Quote Generator application.

## Database Setup

### 1. Create Users Table

Use the `create_users_table_final.sql` file to create the users table. This file will:

- Create the users table with the appropriate structure
- Create indexes to optimize queries
- Add two sample users (admin and staff)

### 2. Create Quotes Table

Use the `create_quotes_table.sql` file to create the quotes table. This file will:

- Create the quotes table with the complete structure
- Set up Row Level Security (RLS) policies

### 3. Add Sample Data

After creating the tables, use the `insert_sample_quotes.sql` file to add sample data to the quotes table.

## Implementation Steps

1. Log in to the Supabase dashboard
2. Navigate to the SQL Editor
3. Open each SQL file and run them in the following order:
   - `create_users_table_final.sql`
   - `create_quotes_table.sql`
   - `insert_sample_quotes.sql`

## Important Notes

- The `insert_sample_quotes.sql` file temporarily disables Row Level Security (RLS) to easily view data without logging in
- When the application is ready for production, you should re-enable RLS with the command:
  ```sql
  ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
  ```

## Environment Configuration

Make sure your `.env.local` file is correctly configured with the Supabase environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```
