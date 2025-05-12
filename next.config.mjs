/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://twxukuqsnejlimtkbsmg.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eHVrdXFzbmVqbGltdGtic21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTI4NDUsImV4cCI6MjA2MjUyODg0NX0.avLS3O0IeV5EKW40ilo9-WpAjzvtIesYKqK0hNJVqw0",
    NEXTAUTH_SECRET: "anhlaanh1",
  },
};

export default nextConfig;
