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
9. [Maintenance Tasks](#maintenance-tasks)
10. [Common Issues and Solutions](#common-issues-and-solutions)
11. [Performance Monitoring](#performance-monitoring)

## Project Overview

The Resort Quote Generator is a web application built for Asteria Mũi Né Resort to streamline the process of creating custom booking quotes. It allows staff to input guest information and instantly generate professional quotes that can be exported as images or PDFs.

## Technical Architecture

- **Frontend Framework**: Next.js (React)
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
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── quote-form.tsx    # Input form component
│   ├── quote-display.tsx # Quote preview component
│   ├── simple-quote-export.tsx # Export functionality
│   ├── resort-header.tsx # Page header
│   ├── resort-footer.tsx # Page footer
│   ├── language-switcher.tsx # Language selection component
│   ├── ui/               # UI components from shadcn/ui
├── lib/                  # Utility functions
│   ├── export-helpers.ts # Helper functions for export
│   ├── translation-context.tsx # Translation context provider
│   ├── translation-utils.ts    # Translation utility functions
│   └── translations/     # Translation files
│       ├── index.ts      # Translation exports
│       ├── en.ts         # English translations
│       ├── vi.ts         # Vietnamese translations
│       ├── cn.ts         # Chinese translations
│       ├── ru.ts         # Russian translations
│       └── kr.ts         # Korean translations
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
│   └── dom-to-image.d.ts # Type declarations for dom-to-image
```

## Key Components

### Quote Form (`components/quote-form.tsx`)

The form component allows users to:

- Manually input guest information
- Import data from clipboard (tab-separated format)
- Use sample data for testing
- Submit form to generate quote

Key functions:

- `handleChange`: Updates form state when inputs change
- `handlePasteData`: Processes clipboard data
- `handleUseSampleData`: Loads sample data
- `processClipboardData`: Parses tab-separated data
- `handleSubmit`: Processes form data and creates quote

### Quote Display (`components/quote-display.tsx`)

This component:

- Displays the quote in a visually appealing format
- Shows customer information, booking details, and pricing
- Updates in real-time as form data changes

It listens for the `updateQuote` custom event from the form component.

### Export Component (`components/simple-quote-export.tsx`)

Provides export functionality:

- PNG image export in different quality levels
- PDF export
- Quality settings adjustment

Uses the helper functions in `lib/export-helpers.ts`.

### Language Switcher (`components/language-switcher.tsx`)

This component:

- Allows users to switch between English, Vietnamese, and Chinese languages
- Displays SVG flag icons for each language option
- Persists language selection in localStorage

## Data Flow

1. User inputs data into `QuoteForm` (or pastes data)
2. On submit or paste, form dispatches `updateQuote` custom event
3. `QuoteDisplay` listens for event and updates display
4. `SimpleQuoteExport` allows exporting the rendered quote

## Dependencies

Main dependencies and their purposes:

| Dependency             | Version  | Purpose                  |
| ---------------------- | -------- | ------------------------ |
| Next.js                | 15.2.4   | React framework          |
| React                  | ^19      | UI library               |
| TypeScript             | ^5       | Type checking            |
| Tailwind CSS           | ^3.4.17  | Styling                  |
| date-fns               | latest   | Date formatting          |
| dom-to-image           | ^2.6.0   | Converting DOM to images |
| jspdf                  | latest   | PDF generation           |
| lucide-react           | ^0.454.0 | Icon set                 |
| @vercel/speed-insights | latest   | Performance monitoring   |

## Styling Guidelines

The application uses Tailwind CSS with the following color scheme:

- Primary color: Sky blue (`sky-800`, `sky-900`)
- Secondary accents: Sky lighter shades (`sky-50`, `sky-200`)
- Text: Dark on light backgrounds, white on dark backgrounds
- Rounded corners for cards and buttons

Components follow the shadcn/ui styling conventions.

### Mobile Responsiveness

The application is designed to be fully responsive:

- On mobile devices, the input form appears above the quote display for better user experience
- This is achieved using a flex column layout that stacks the components vertically on mobile
- On desktop devices, the layout switches to a side-by-side grid view
- The implementation uses `flex flex-col md:grid md:grid-cols-2` in the main container

### Currency Formatting

All monetary values in the application use proper thousands separators and appropriate currency symbols:

- Monetary values are displayed with language-specific formatting
- English: values displayed with comma separators and VND suffix (e.g., 2,000,000 VND)
- Vietnamese: values displayed with period separators and VNĐ suffix (e.g., 2.000.000 VNĐ)
- Chinese: values displayed with comma separators and VND suffix (e.g., 2,000,000 VND)
- Russian: values displayed with comma separators and VND suffix (e.g., 2,000,000 VND)
- Korean: values displayed with comma separators and VND suffix (e.g., 2,000,000 VND)
- Formatting logic in the `QuoteForm` component adapts based on the current language setting

## Internationalization

The application supports English, Vietnamese, Chinese, Russian, and Korean languages via a custom translation system.

### Translation Structure

- **Context Provider**: `lib/translation-context.tsx` provides translation context
- **Translation Files**:
  - `lib/translations/en.ts`: English translations
  - `lib/translations/vi.ts`: Vietnamese translations
  - `lib/translations/cn.ts`: Chinese translations
  - `lib/translations/ru.ts`: Russian translations
  - `lib/translations/kr.ts`: Korean translations
  - `lib/translations/index.ts`: Exports type definitions and translation objects
- **Utility Functions**:
  - `lib/translation-utils.ts`: Contains language information and helper functions

### How to Add New Translations

1. Identify new text that needs translation
2. Add the translation key and text to all language files
3. Organize translations in appropriate nested objects by feature/component
4. Use the translation function in components: `const { t } = useTranslation()` and `{t("key.nestedKey")}`

### Language Switching

The `LanguageSwitcher` component in `components/language-switcher.tsx` handles language switching:

- Displays the current language with its flag icon
- Offers a dropdown to select a different language
- Saves selection to localStorage for persistence between sessions

### SVG Flag Icons

The application uses custom hand-crafted SVG files for flag icons:

- Located in `public/flags/` directory
- Benefits over bitmap images:
  - Smaller file size
  - Perfect scaling at any resolution
  - CSS styling capabilities
  - Better accessibility

To add a new language:

1. Create a new SVG flag file in `public/flags/` (e.g., `fr.svg` for French)
2. Add the language to the `supportedLanguages` array in `lib/translation-utils.ts`
3. Create a new translation file in `lib/translations/` (e.g., `fr.ts`)
4. Import and export the new translation in `lib/translations/index.ts`
5. Update the Language type in `lib/translations/index.ts` to include the new language code

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

## Common Issues and Solutions

### Type Errors for External Libraries

If you encounter TypeScript errors for external libraries, check if type definitions exist:

```bash
npm i --save-dev @types/library-name
```

If not available, create declaration files in the `types/` directory, like we did for `dom-to-image`.

The application includes custom type declarations for the dom-to-image library in `types/dom-to-image.d.ts` along with helper functions in `lib/export-helpers.ts` to ensure type safety.

### Export Quality Issues

If export quality is poor:

1. Check the `qualitySettings` in `lib/export-helpers.ts`
2. Adjust scale and quality parameters for better results

The application currently supports:

- PNG export with three quality levels (normal, high, ultra)
- PDF export that maintains the formatting of the quote display

### Styling Inconsistencies

If styles appear inconsistent:

1. Ensure Tailwind classes are applied correctly
2. Check for conflicting styles in global CSS
3. Verify the component inherits the correct theme settings

### React Hydration Errors

If you encounter hydration errors (server and client HTML mismatch):

1. Ensure `suppressHydrationWarning` attribute is present on both `<html>` and `<body>` tags in `app/layout.tsx`
2. This is particularly important for preventing errors caused by browser extensions like Grammarly that add attributes to HTML elements
3. Be cautious with client-side only code that might render differently from server-side

### Translation Issues

If translations aren't working properly:

1. Check that the translation key exists in all language files
2. Verify the component is using the translation hook: `const { t } = useTranslation()`
3. Ensure the nesting structure matches exactly in the translation call: `t("section.subsection.key")`
4. Check that the TranslationProvider wraps the component in the component tree

## Performance Monitoring

The application uses Vercel Speed Insights to monitor and analyze performance:

1. The integration is set up in `app/layout.tsx` with the `<SpeedInsights />` component
2. Performance metrics are automatically collected and available in the Vercel dashboard
3. Use these insights to identify potential performance bottlenecks and optimize accordingly

---

For any further assistance, contact the development team or refer to the source code which contains detailed comments.
