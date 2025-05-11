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
│   ├── resort-footer.tsx # Page footer with multilingual support
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
│   ├── logo-white.svg    # White version of resort logo for footer
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

## Key Components

### ResortFooter Component

The `ResortFooter` component is defined in `components/resort-footer.tsx` and provides the footer section of the application with comprehensive multilingual support.

**Key Features:**

1. **Multilingual Support**: Dynamically displays content based on the current language
2. **Three-Column Layout**:
   - Left Column: Address, contact information, and subscription form
   - Middle Column: Resort logo and social media links
   - Right Column: Google Maps iframe showing resort location
3. **Localized Address Display**: Shows the resort address in the appropriate format and language
4. **Contact Information**: Phone number and email with appropriate styling
5. **Newsletter Subscription**: Form with email input and submit button
6. **Social Media Links**: SVG icons for Instagram, X (Twitter), and Facebook
7. **Map Integration**: Embedded Google Maps showing the resort location
8. **Credits Section**: Displays developer credits with GitHub links

**Implementation Details:**

The component uses helper functions to manage language-specific content:

```javascript
// Get the connector text based on language
const getConnector = () => {
  switch (currentLanguage) {
    case "vi":
      return "và";
    case "cn":
      return "和";
    case "ru":
      return "и";
    case "kr":
      return "및";
    default:
      return "and";
  }
};

// Get the appropriate address based on the current language
const getLocalizedAddress = () => {
  switch (currentLanguage) {
    case "en":
      return "08 Xuan Thuy Street, Ward 5, Mui Ne Ward, Phan Thiet City, Binh Thuan Province, Vietnam";
    case "ru":
      return "08 ул. Суан Туи, Район 5, район Муй Не, город Фантьет, провинция Бинь Туан, Вьетнам";
    case "kr":
      return "베트남 빈투언성 판티엣시 무이네구 5지구 쑤안투이 거리 08번지";
    case "cn":
      return "越南平顺省潘切市美奈坊第5坊春水街08号";
    case "vi":
      return "08 đường Xuân Thủy, phường 5, phường Mũi Né, thành phố Phan Thiết, tỉnh Bình Thuận, Việt Nam";
    default:
      return "08 Xuan Thuy Street, Ward 5, Mui Ne Ward, Phan Thiet City, Binh Thuan Province, Vietnam";
  }
};
```

**Maintenance Considerations:**

1. **Adding New Languages**: When adding a new language, be sure to:

   - Add the appropriate address format in `getLocalizedAddress()`
   - Add the connector word in `getConnector()`
   - Add the prefix/suffix text in the JSX for the "Made by" section
   - Update the translation files with all footer-related keys

2. **Changing Contact Info**: If the resort's contact information changes:

   - Update the phone number in the `href="tel:+842523822222"` attribute
   - Update the email in the `href="mailto:info@asteriamuineresort.com"` attribute
   - These changes only need to be made once as they are not language-specific

3. **Updating Map**:

   - Replace the Google Maps iframe URL with a new embed link
   - The current map uses a wider area view with coordinates 10.950745, 108.301872 for Asteria Mũi Né Resort
   - The resort is located at KM 11 Hon Rom Road, Ham Tien Ward, Phan Thiet City
   - The map includes accessibility attributes (title and aria-label) for better screen reader support
   - A directions hint is displayed below the map with translations for all languages
   - To change the map location or zoom level, generate a new embed code from Google Maps:
     1. Go to Google Maps and search for "Asteria Mui Ne Resort"
     2. Click "Share" and select "Embed a map"
     3. Choose your preferred size and zoom level
     4. Copy the iframe code and update the src attribute in the component
   - The current map uses a wider zoom level to show surrounding area and provide better context
   - Always preserve the responsive attributes (width="100%", height="100%") for proper display on all devices

4. **Social Media Updates**: To add or change social media links:

   - Update the `href` attributes with the correct URLs
   - Ensure SVG icons are correctly sized (currently 28x28)
   - Maintain the hover effect styling (`hover:text-yellow-400 transition`)

5. **Updating footer colors**:
   - Modify the Tailwind CSS classes in the component
   - Main footer: `bg-sky-900`
   - Bottom bar: `bg-sky-950`
   - Accent colors: `text-[#c5965a]` (gold)
   - Hover effects: `hover:text-yellow-400`, `hover:bg-[#c5965a]`

## Internationalization

The application features a comprehensive translation system with support for English, Vietnamese, Chinese, Russian, and Korean languages. This system is based on a custom React context that provides translations to components throughout the application.

### Translation System Architecture

1. **Translation Context**: Defined in `lib/translation-context.tsx`, this provides:

   - A React context for accessing translations
   - Language switching functionality
   - Persistent language selection using localStorage
   - Language information including name, code, and direction
   - The `t()` function to retrieve translated strings

2. **Translation Files**: Located in `lib/translations/`:

   - `en.ts`: English translations
   - `vi.ts`: Vietnamese translations
   - `cn.ts`: Chinese translations
   - `ru.ts`: Russian translations
   - `kr.ts`: Korean translations
   - `index.ts`: Exports all translations and defines language types

3. **Utility Functions**: In `lib/translation-utils.ts`:

   - Language detection based on browser settings
   - Helper functions for language information
   - Type definitions for language data

4. **Language Switcher Component**: In `components/language-switcher.tsx`:
   - UI for changing between languages
   - Displays flag icons for each language option
   - Visual indication of current language

### Translation File Structure

All translation files follow the same nested structure to ensure consistency:

```typescript
export const en = {
  common: {
    title: "Asteria Mũi Né Resort - Booking Quote",
    description: "Booking quote system for Asteria Mũi Né Resort",
    language: "English",
  },
  nav: {
    // Navigation-related translations
  },
  auth: {
    // Authentication-related translations
  },
  form: {
    // Form-related translations
    placeholder: {
      // Form placeholders
    },
  },
  quote: {
    // Quote display translations
  },
  export: {
    // Export-related translations
  },
  footer: {
    // Footer-related translations
    resort: "Asteria Mũi Né Resort",
    description: "Modern resort located on...",
    amenities: "Amenities",
    // ...more footer translations
    address: "ADDRESS",
    contactInfo: "CONTACT INFORMATION",
    subscribeToOffers: "SUBSCRIBE TO OFFERS",
    // ...other footer elements
  },
};
```

### Using Translations in Components

To use translations in a component:

1. Import the translation hook:

   ```typescript
   import { useTranslation } from "@/lib/translation-context";
   ```

2. Use the hook to access translations:

   ```typescript
   const { t, currentLanguage } = useTranslation();
   ```

3. Retrieve translated strings using the `t()` function:

   ```typescript
   <h1>{t("form.guestName")}</h1>
   <p>{t("quote.description")}</p>
   ```

4. Access the current language if needed for language-specific logic:
   ```typescript
   {
     currentLanguage === "en" && <span>English-only content</span>;
   }
   ```

### Advanced Translation Features

#### Dynamic String Replacement

For translations with variables, use template literals or string replacement:

```typescript
// In translation file
totalRoomCost: "Total room cost ({nights} nights)",

// In component
const nightsText = t("quote.totalRoomCost").replace("{nights}", nights.toString());
```

#### Language-Specific Formatting

Some components implement language-specific formatting for elements like addresses, connectors, or structural elements:

```typescript
// Example from ResortFooter
const getConnector = () => {
  switch (currentLanguage) {
    case "vi":
      return "và";
    case "cn":
      return "和";
    // other languages...
    default:
      return "and";
  }
};
```

#### Conditional Rendering Based on Language

For complex language-specific adjustments:

```jsx
{
  currentLanguage === "en" && "Made by ";
}
{
  currentLanguage === "vi" && "Được phát triển bởi ";
}
{
  currentLanguage === "cn" && "由 ";
}
{
  /* More language conditions */
}
```

### Guidelines for Maintaining Translations

1. **Adding New Text**:

   - Add the new key to each language file
   - Keep keys consistent across all language files
   - Use nested objects for organization
   - Document any variables used in strings with {placeholders}

2. **Adding a New Language**:

   - Create a new file in `lib/translations/` (e.g., `fr.ts`)
   - Copy the structure from an existing language file
   - Translate all strings, maintaining the same keys
   - Update `lib/translations/index.ts` to include the new language
   - Add the language to the supported languages array in `lib/translation-utils.ts`
   - Create a flag icon in SVG format in `public/flags/`
   - Add language-specific logic to components that require it (like ResortFooter)

3. **Translation Quality**:

   - Ensure natural phrasing in each language
   - Avoid machine translation when possible
   - Consider cultural differences in wording and formatting
   - Verify length constraints for UI elements like buttons and labels
   - Test the application in each language to identify any display issues

4. **Performance Considerations**:
   - Keep translation files well-organized to maintain readability
   - Consider code splitting for very large translation sets
   - Use the translation context efficiently to minimize rerenders

### Common Internationalization Issues

1. **Missing Translations**:

   - Check that all keys exist in all language files
   - Add default fallbacks for missing translations

2. **Text Overflow**:

   - Some languages (like Russian) may have longer text
   - Use flexible layouts that can accommodate varying text lengths
   - Test UI elements with all languages to ensure proper display

3. **Right-to-Left Support**:

   - Current languages are all left-to-right, but the system supports RTL
   - When adding RTL languages, test thoroughly for layout issues

4. **Date and Currency Formatting**:
   - Use language-appropriate formatters for dates and currencies
   - Consider adding language-specific formatting helpers

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

### Modifying the Footer

The footer layout is defined in `components/resort-footer.tsx`.

1. **Updating contact information**:

   - Edit the phone number in the `<a href="tel:+842523822222">` tag
   - Edit the email in the `<a href="mailto:info@asteriamuineresort.com">` tag

2. **Changing address**:

   - Update the address in each language in the `getLocalizedAddress()` function

3. **Modifying social media links**:

   - Edit the URLs in the `<a href="...">` tags
   - Replace or modify the SVG icons as needed

4. **Updating map**:

   - Replace the Google Maps iframe URL with a new embed link
   - The current map uses a wider area view with coordinates 10.950745, 108.301872 for Asteria Mũi Né Resort
   - The resort is located at KM 11 Hon Rom Road, Ham Tien Ward, Phan Thiet City
   - The map includes accessibility attributes (title and aria-label) for better screen reader support
   - A directions hint is displayed below the map with translations for all languages
   - To change the map location or zoom level, generate a new embed code from Google Maps:
     1. Go to Google Maps and search for "Asteria Mui Ne Resort"
     2. Click "Share" and select "Embed a map"
     3. Choose your preferred size and zoom level
     4. Copy the iframe code and update the src attribute in the component
   - The current map uses a wider zoom level to show surrounding area and provide better context
   - Always preserve the responsive attributes (width="100%", height="100%") for proper display on all devices

5. **Changing footer colors**:
   - Modify the Tailwind CSS classes in the component
   - Main footer: `bg-sky-900`
   - Bottom bar: `bg-sky-950`
   - Accent colors: `text-[#c5965a]` (gold)
   - Hover effects: `hover:text-yellow-400`, `hover:bg-[#c5965a]`
