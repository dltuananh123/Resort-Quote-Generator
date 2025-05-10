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
8. [Maintenance Tasks](#maintenance-tasks)
9. [Common Issues and Solutions](#common-issues-and-solutions)

## Project Overview

The Resort Quote Generator is a web application built for Asteria Mũi Né Resort to streamline the process of creating custom booking quotes. It allows staff to input guest information and instantly generate professional quotes that can be exported as images or PDFs.

## Technical Architecture

- **Frontend Framework**: Next.js (React)
- **Type Checking**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Export Functionality**: DOM-to-image and jsPDF
- **Date Handling**: date-fns with Vietnamese locale

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
│   ├── ui/               # UI components from shadcn/ui
├── lib/                  # Utility functions
│   └── export-helpers.ts # Helper functions for export
├── public/               # Static assets
│   ├── favicon.svg       # Favicon vector image
│   ├── logo.svg          # Resort logo
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

## Data Flow

1. User inputs data into `QuoteForm` (or pastes data)
2. On submit or paste, form dispatches `updateQuote` custom event
3. `QuoteDisplay` listens for event and updates display
4. `SimpleQuoteExport` allows exporting the rendered quote

## Dependencies

Main dependencies and their purposes:

| Dependency   | Version  | Purpose                  |
| ------------ | -------- | ------------------------ |
| Next.js      | 15.2.4   | React framework          |
| React        | ^19      | UI library               |
| TypeScript   | ^5       | Type checking            |
| Tailwind CSS | ^3.4.17  | Styling                  |
| date-fns     | latest   | Date formatting          |
| dom-to-image | ^2.6.0   | Converting DOM to images |
| jspdf        | latest   | PDF generation           |
| lucide-react | ^0.454.0 | Icon set                 |

## Styling Guidelines

The application uses Tailwind CSS with the following color scheme:

- Primary color: Sky blue (`sky-800`, `sky-900`)
- Secondary accents: Sky lighter shades (`sky-50`, `sky-200`)
- Text: Dark on light backgrounds, white on dark backgrounds
- Rounded corners for cards and buttons

Components follow the shadcn/ui styling conventions.

## Maintenance Tasks

### Adding a New Feature

1. Identify the component that needs to be modified
2. Make changes following the existing patterns and styles
3. Test the changes in development mode (`npm run dev`)
4. Ensure responsive design works on mobile devices

### Updating the Logo/Favicon

1. Replace the SVG files in the `public` directory
2. Run the favicon generation script if needed:
   ```
   npm run generate-favicon
   ```
3. Verify the logo appears correctly in the header and as favicon

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

### Export Quality Issues

If export quality is poor:

1. Check the `qualitySettings` in `lib/export-helpers.ts`
2. Adjust scale and quality parameters for better results

### Styling Inconsistencies

If styles appear inconsistent:

1. Ensure Tailwind classes are applied correctly
2. Check for conflicting styles in global CSS
3. Verify the component inherits the correct theme settings

---

For any further assistance, contact the development team or refer to the source code which contains detailed comments.
