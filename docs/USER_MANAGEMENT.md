# User Management with Supabase

This document provides instructions for setting up and managing users with Supabase in the Resort Quote Generator application.

## Setting Up the Users Table in Supabase

1. **Create the Users Table**:

   - Go to your Supabase project dashboard
   - Navigate to "SQL Editor" in the left sidebar
   - Create a new query
   - Copy and paste the code from `setup/create_users_table_final.sql`
   - Run the query to create the table and insert initial users

   The table has the following structure:

   | Column Name | Type        | Default Value     | Primary  | Nullable |
   | ----------- | ----------- | ----------------- | -------- | -------- |
   | id          | uuid        | gen_random_uuid() | Yes (PK) | No       |
   | created_at  | timestamptz | now()             | No       | No       |
   | full_name   | text        |                   | No       | No       |
   | email       | text        |                   | No       | No       |
   | pass        | text        |                   | No       | No       |
   | user_role   | text        | 'user'            | No       | No       |

2. **Import Initial Users**:

   - Alternatively, you can import users from the provided CSV:
   - In the "Table Editor", select the `users` table
   - Click "Import" at the top of the table
   - Select "CSV" and upload the `users_table.csv` file
   - Make sure "CSV includes header row" is checked
   - Select "UUID" for the `id` column format
   - Map the columns if they don't automatically match
   - Click "Import"

3. **Set Up RLS Policies** (Optional but Recommended):
   - In the "Authentication" > "Policies" section, set up appropriate Row Level Security (RLS) policies for the `users` table
   - Example policy for admins to read all users:
     - Name: "Admins can read all users"
     - Operation: SELECT
     - Target roles: authenticated
     - Using expression: `(auth.jwt() ->> 'role')::text = 'admin'`

## User Management API Endpoints

The application includes the following endpoints for user management:

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a new user (admin only)
- `GET /api/users/[id]` - Get a specific user by ID (admin only)
- `PUT /api/users/[id]` - Update a user (admin only)
- `DELETE /api/users/[id]` - Delete a user (admin only)

These endpoints automatically connect to your Supabase database when you've set up your environment variables correctly.

## Password Security

**Important Note**: The current implementation stores passwords as plain text, which is not secure for production use. In a real-world application, you should:

1. Hash passwords before storing them using bcrypt or a similar algorithm
2. Consider using Supabase Auth for authentication rather than managing passwords yourself

## User Roles

The application supports two roles:

- `admin` - Has full access to manage quotes and users
- `user` - Can only manage quotes

The system prevents deleting the last admin user to ensure there's always at least one admin account.

## Connecting the Frontend

The frontend user management component (`components/users-manager.tsx`) connects to these API endpoints automatically. When you visit the user management section of the application, it will display users from your Supabase database.

## Troubleshooting

- If you encounter "Unauthorized" errors, make sure you're logged in as an admin
- For database connection issues, verify your Supabase environment variables are correctly set in `.env.local`
- Check the browser console and server logs for detailed error messages
