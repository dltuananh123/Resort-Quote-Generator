# Resort Quote Generator Maintenance Documentation

This document provides comprehensive information for maintaining and updating the Resort Quote Generator application for Asteria Mũi Né Resort.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Directory Structure](#directory-structure)
4. [Key Components](#key-components)
5. [Data Flow](#data-flow)
6. [Dependencies](#dependencies)
7. [Styling Guidelines](#styling-guidelines)
8. [Internationalization](#internationalization)
9. [Authentication and Security](#authentication-and-security)
10. [Maintenance Tasks](#maintenance-tasks)
11. [Common Issues and Solutions](#common-issues-and-solutions)
12. [Performance Monitoring](#performance-monitoring)

## Project Overview

The Resort Quote Generator is a web application built for Asteria Mũi Né Resort to streamline the process of creating custom booking quotes. It allows staff to input guest information and instantly generate professional quotes that can be exported as images or PDFs. The application includes secure authentication to ensure only authorized staff can access the system.

## Technical Architecture

- **Frontend Framework**: Next.js (React)
- **Authentication**: NextAuth.js with credential provider
- **Type Checking**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Export Functionality**: DOM-to-image and jsPDF
- **Date Handling**: date-fns with Vietnamese locale
- **Performance Monitoring**: Vercel Speed Insights
- **Internationalization**: Custom translation context with English, Vietnamese, Chinese, Russian, and Korean support
- **Icons and Graphics**: Lucide React icons and hand-crafted SVG assets

## Directory Structure

```
resort-quote/
├── app/                  # Next.js app directory
│   ├── api/              # API routes including authentication
│   │   ├── auth/         # NextAuth.js authentication API routes
│   │   │   └── [...nextauth]/ # NextAuth.js configuration
│   ├── auth/             # Authentication-related pages
│   │   ├── login/        # Login page
│   │   └── profile/      # User profile page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── auth/             # Authentication-related components
│   ├── quote-form.tsx    # Input form component
│   ├── quote-display.tsx # Quote preview component
│   ├── simple-quote-export.tsx # Export functionality
│   ├── resort-header.tsx # Page header
│   ├── resort-footer.tsx # Page footer
│   ├── language-switcher.tsx # Language selection component
│   ├── ui/               # UI components from shadcn/ui
├── lib/                  # Utility functions
│   ├── export-helpers.ts # Helper functions for export
│   ├── auth.ts           # Authentication helper functions
│   ├── translation-context.tsx # Translation context provider
│   ├── translation-utils.ts    # Translation utility functions
│   └── translations/     # Translation files
│       ├── index.ts      # Translation exports
│       ├── en.ts         # English translations
│       ├── vi.ts         # Vietnamese translations
│       ├── cn.ts         # Chinese translations
│       ├── ru.ts         # Russian translations
│       └── kr.ts         # Korean translations
├── middleware.ts         # NextAuth.js middleware for route protection
├── public/               # Static assets
│   ├── favicon.svg       # Favicon vector image
│   ├── logo.svg          # Resort logo
│   └── flags/            # SVG flag icons for language switcher
│       ├── en.svg        # English flag (UK)
│       ├── vi.svg        # Vietnamese flag
│       ├── cn.svg        # Chinese flag
│       ├── ru.svg        # Russian flag
│       └── kr.svg        # Korean flag
├── scripts/              # Utility scripts
│   └── generate-favicon.js # Script to generate favicon files
├── styles/               # Additional styling
├── types/                # TypeScript type definitions
│   ├── next-auth.d.ts    # NextAuth.js type extensions
│   └── dom-to-image.d.ts # Type declarations for dom-to-image
```

## Authentication and Security

The application uses NextAuth.js for authentication, which provides a secure and flexible solution for handling user authentication.

### NextAuth.js Implementation

The authentication system is configured in `app/api/auth/[...nextauth]/route.ts` with the following features:

1. **Credential Provider**: Custom implementation that verifies username and password against a predefined list of users (in a production environment, this would connect to a secure database):

```typescript
// Example configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In production, this would validate against a secure database
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo users for testing
        const users = [
          {
            id: "1",
            email: "admin@example.com",
            name: "Admin User",
            password: "password123",
            role: "admin",
          },
          {
            id: "2",
            email: "staff@example.com",
            name: "Staff User",
            password: "password123",
            role: "staff",
          },
        ];

        const user = users.find((user) => user.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

2. **Custom Login Page**: Located at `app/auth/login/page.tsx` with:

   - Email and password form fields
   - Error handling for invalid credentials
   - Multilingual support
   - Responsive design

3. **User Profile Page**: At `app/auth/profile/page.tsx` showing:

   - User information (name, email, role)
   - Account statistics (demo implementation)
   - Protected by middleware to ensure only authenticated users can access

4. **Route Protection Middleware**: Configured in `middleware.ts` to protect routes:

```typescript
// Example middleware implementation
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/auth/login" ||
    path === "/" ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.includes(".");

  // Get the token from the NextAuth.js session
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login page, redirect to profile
    if (path === "/auth/login") {
      return NextResponse.redirect(new URL("/auth/profile", request.url));
    }
    return NextResponse.next();
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
};
```

5. **Authentication UI Components**:
   - Login form component with validation
   - Authentication status indicator in header
   - User profile display
   - All with full multilingual support

### Security Considerations

1. **JWT Secret**: Store in environment variables, never in the code:

   ```
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Password Storage**: In a production environment, passwords should be:

   - Stored with secure hashing (bcrypt, Argon2)
   - Never stored in plain text
   - Validated securely with timing-safe comparisons

3. **Session Handling**:

   - JWT-based sessions for stateless operation
   - Proper expiration times set
   - Secure cookie settings enabled

4. **Role-Based Access Control**:
   - Different permissions for admin vs. staff roles
   - Access control checks in protected routes
   - Front-end UI adapts based on user role

### Modifying the Authentication System

When modifying the authentication system, follow these guidelines:

1. **Adding Users**: In a production environment, create a secure database connector:

   ```typescript
   async function validateUser(email: string, password: string) {
     // Connect to your database
     const user = await db.users.findUnique({ where: { email } });

     // Verify password with secure comparison
     if (user && (await bcrypt.compare(password, user.passwordHash))) {
       return {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
       };
     }

     return null;
   }
   ```

2. **Adding New Roles**: Extend the role system by:

   - Adding new role types to the NextAuth.js type declarations
   - Creating appropriate permission checks in middleware
   - Updating UI to reflect different role capabilities

3. **Authentication Debugging**:
   - Check session status with the NextAuth.js session hooks
   - Verify cookie storage in browser developer tools
   - Test protected routes with both authenticated and unauthenticated users

### Common Authentication Issues

If you encounter authentication problems:

1. **Session Not Persisting**:

   - Verify the NEXTAUTH_SECRET is correctly set
   - Check that cookies are being stored properly
   - Ensure the session strategy is set to "jwt"

2. **Middleware Not Working**:

   - Check matcher patterns are correctly configured
   - Verify request paths are being correctly analyzed
   - Test with logging statements to trace the execution flow

3. **Role-Based Access Not Working**:
   - Ensure roles are being saved to the JWT token
   - Verify session callback is including role information
   - Check that components are checking role information correctly

## Maintenance Tasks

### Adding a New Feature

1. Identify the component that needs to be modified
2. Make changes following the existing patterns and styles
3. Test the changes in development mode (`npm run dev`)
4. Ensure responsive design works on mobile devices
5. Add translations for any new text in all language files

### Updating the Logo/Favicon

1. Replace the SVG files in the `public` directory
2. Run the favicon generation script if needed:
   ```
   npm run generate-favicon
   ```
3. Verify the logo appears correctly in the header and as favicon

### Adding a New Language

1. Create a new translation file in `lib/translations/` (e.g., `fr.ts`)
2. Copy the structure from an existing translation file and translate all strings
3. Add the language to the array in `lib/translation-context.tsx`
4. Create an SVG flag icon in `public/flags/` directory
5. Update type definitions in `lib/translations/index.ts`

### Modifying Quote Layout

The quote layout is defined in `components/quote-display.tsx`. Update the JSX structure to change the layout.

### Changing Pricing Calculations

Update the calculation logic in the `handleSubmit` function of `components/quote-form.tsx`.
