# Resort Quote Generator

A modern, elegant web application for generating professional resort booking quotes for Asteria Mũi Né Resort.

## 📋 Version

**Current Version:** 2.0.3  
**Last Updated:** May 2025

### Changelog

- **v2.0.3** - Updated resort location to KM 11 Hon Rom Road with wider area view map and enhanced documentation for map embedding
- **v2.0.2** - Enhanced Google Maps integration with improved pin location, accessibility features, and multilingual directions hint
- **v2.0.1** - Fixed React dependency conflict by downgrading to React 18.3.1 for compatibility with react-day-picker
- **v2.0.0** - Major security update with NextAuth.js integration for secure authentication, added user roles (admin/user), implemented protected routes and secure session management
- **v1.7.4** - Enhanced footer with multilingual address support for English, Vietnamese, Chinese, Russian, and Korean
- **v1.7.3** - Added multilingual footer with translations for all five supported languages
- **v1.7.2** - Enhanced translations for Chinese, Korean, and Russian languages with improved terminology, natural phrasing, and cultural appropriateness
- **v1.7.1** - Optimized Russian translations with shorter phrases to improve UI button sizing and prevent text overflow
- **v1.7.0** - Added Korean language support with appropriate flag icon and translations
- **v1.6.0** - Added Russian language support with appropriate flag icon and translations
- **v1.5.0** - Added Chinese language support, enhanced language switcher with country flags, updated currency formatting
- **v1.4.0** - Enhanced responsive design with mobile-friendly hamburger menu, fixed navigation internationalization, updated Lucide icons for a consistent UI
- **v1.3.0** - Added multi-language support with English and Vietnamese translations, Language switcher in the header
- **v1.2.0** - Added mobile-optimized layout, currency formatting with thousands separators, fixed type declarations, improved export functionality
- **v1.1.0** - Initial public release with basic quote generation functionality
- **v1.0.0** - Initial development version

## 🌟 Project Overview

This application streamlines the process of creating custom booking quotes for resort guests. It features a clean, user-friendly interface that allows staff to quickly generate professionally formatted quotes based on guest details and booking information. With secure authentication, it ensures that only authorized staff members can access the system.

## ✨ Features

- **Secure Authentication**: NextAuth.js integration with credential provider for secure staff login
- **Role-Based Access**: Different access levels for admin and staff users
- **Protected Routes**: Middleware-based protection of sensitive application areas
- **Session Management**: Secure JWT-based sessions with proper expiration handling
- **Dynamic Quote Generation**: Create professional resort booking quotes in real-time
- **Dual Input Methods**: Enter data manually or paste formatted data from clipboard
- **Sample Data Option**: Quick testing and demonstration using pre-populated data
- **Real-time Preview**: See the quote update as you enter information
- **Responsive Design**: Works seamlessly on both desktop and mobile devices with optimized layout
- **Mobile-Optimized Layout**: Input form displays above quote preview on mobile devices for better usability
- **Mobile Navigation**: Hamburger menu with smooth animations for better mobile experience
- **Modern Icon System**: Integrated Lucide icons for consistent visual language
- **Localized for Multiple Languages**: Full support for English, Vietnamese, Chinese, Russian, and Korean translations
- **Thousands Separators**: Automatic formatting of price fields for better readability
- **Multi-language Support**: Switch between languages with a simple selector featuring country flags
- **Performance Monitoring**: Integrated with Vercel Speed Insights for real-time performance analytics
- **Browser Extension Compatible**: Special handling to prevent hydration errors with Grammarly and similar extensions
- **Export Options**: Generate high-quality PNG and PDF versions of quotes
- **Hand-crafted SVG Flags**: Custom SVG flag icons for language selection, optimized for performance and scalability
- **Fully Localized Footer**: Resort information, address, and contact details translated in all supported languages

## 💻 Technologies Used

- **Next.js**: React framework for building the UI
- **NextAuth.js**: Authentication framework for secure login and session management
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: Modern UI component library
- **date-fns**: For date manipulation and formatting
- **Lucide React**: For beautiful icons
- **Vercel Speed Insights**: For performance monitoring

## 👨‍💻 Developers

### 💻dltuananh123

**Skills & Contributions:**

- Frontend development with React and Next.js
- UI/UX design implementation
- TypeScript integration
- Form state management and validation
- Internationalization for Vietnamese language
- Authentication system implementation

### 🔢bechovang

**Skills & Contributions:**

- Component architecture design
- Real-time data processing
- Event-based state management
- Custom formatting for currency and dates
- Responsive layout implementation
- Security enhancement and middleware configuration

## 🚀 Key Technical Achievements

- **Secure Authentication System**: Implementation of NextAuth.js with credential provider and role-based access control
- **Protected Route Middleware**: Server-side route protection to prevent unauthorized access
- **Custom Event System**: Using CustomEvent for communication between components
- **Intelligent Data Parsing**: Automatic extraction and formatting of pasted tab-separated data
- **Currency Formatting**: Automatic thousands separators for price inputs
- **Date Processing**: Calculation of stay duration and cost based on check-in/check-out dates
- **Advanced State Management**: Efficient form data handling with React hooks
- **Responsive Layout Design**: Optimized user experience on both mobile and desktop devices
- **Custom Type Declarations**: TypeScript type safety for external libraries like dom-to-image
- **Export Functionality**: High-quality PNG and PDF export with multiple quality settings
- **Hydration Error Prevention**: Special handling to accommodate browser extensions like Grammarly
- **Hand-crafted SVG Assets**: Custom SVG flags created manually to reduce file size, improve scalability, and ensure seamless CSS integration
- **Comprehensive Internationalization**: Complete multilingual experience with localized content, including address formatting in native formats

## 📸 Screenshots

[Screenshots can be added here to showcase the application's interface]

## 🛠️ Setup and Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd resort-quote

# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📊 Performance Monitoring

The application is integrated with Vercel Speed Insights for performance monitoring:

1. Performance metrics are automatically collected during user sessions
2. Data is available in the Vercel dashboard for analysis
3. No additional configuration is required - it works out of the box

## 🛠️ Technical Notes

### Authentication System

The application uses NextAuth.js for secure authentication:

- **Credential Provider**: Custom implementation with username/password verification
- **JWT Session Handling**: Secure token-based sessions with proper encryption
- **Role-Based Access**: Different permissions for admin and staff roles
- **Protected Routes**: Middleware that redirects unauthenticated users to login
- **User Profiles**: Personalized profile pages showing account information
- **Multilingual Support**: Login system fully translated in all supported languages

### Hydration Error Prevention

The application includes special handling to prevent React hydration errors that can occur when browser extensions like Grammarly modify the DOM:

```tsx
// In app/layout.tsx
<html lang="vi" suppressHydrationWarning>
  <head />
  <body suppressHydrationWarning>{/* Content */}</body>
</html>
```

The `suppressHydrationWarning` attribute helps prevent errors when browser extensions add attributes to HTML elements.

### Internationalization

The application features a comprehensive translation system with support for English, Vietnamese, Chinese, Russian, and Korean:

- Translation context provides language switching capabilities with country flag indicators
- Language preference is saved to localStorage for persistence between sessions
- All UI elements including navigation, forms, buttons, and footer are fully translated
- Language selection is maintained when refreshing the page
- Currency formats are adapted based on language selection
- Optimized text length for Russian language to prevent UI elements from overflowing, especially in buttons and form labels
- Culturally appropriate translations with native-language examples and naming conventions
- Standardized language codes (cn for Chinese, kr for Korean) for consistent implementation
- Complete multilingual footer with resort description, amenities, and quick links in all five languages
- Localized addresses displayed in culturally appropriate formats for each supported language
- Dynamically rendered text content that automatically adjusts based on the selected language

### UI Text Optimization

The application includes language-specific text optimizations:

- **Russian language**: Shortened phrases for better fit in UI elements without overflow
- **Chinese language**: Improved terminology for better clarity and cultural appropriateness
- **Korean language**: Enhanced natural phrasing for better user experience
- **Button text**: Condensed labels for better appearance across all screen sizes
- **Form labels**: Optimized for compact display while maintaining clarity
- **Error messages**: Streamlined for clear presentation in modals and notifications
- **Footer**: Culturally appropriate translations with consistent terminology across all site sections
- **Addresses**: Formatted according to local conventions for each language for better readability

### SVG Flag Icons

The flag icons used in the language switcher are hand-crafted SVG files that provide several advantages:

- **Minimal File Size**: Optimized SVGs take up less space and load faster than bitmap images
- **Perfect Scaling**: Vector-based icons look crisp at any size without pixelation
- **CSS Integration**: Can be styled with CSS directly for hover effects and animations
- **Accessibility**: Better screen reader support with appropriate alt text
- **Customization**: Easily modifiable for adding new language options in the future

## 💡 Future Enhancements

- Advanced user management system
- Integration with booking systems
- Quote history and management
- Additional language support
- Analytics dashboard

---

_Developed with ❤️ by [dltuananh123](https://github.com/dltuananh123) and [bechovang](https://github.com/bechovang)_
