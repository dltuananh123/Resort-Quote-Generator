# Resort Quote Generator

A modern, elegant web application for generating professional resort booking quotes for Asteria Mũi Né Resort.

## 📋 Version

**Current Version:** 1.4.0  
**Last Updated:** May 2025

### Changelog

- **v1.4.0** - Enhanced responsive design with mobile-friendly hamburger menu, fixed navigation internationalization, updated Lucide icons for a consistent UI
- **v1.3.0** - Added multi-language support with English and Vietnamese translations, Language switcher in the header
- **v1.2.0** - Added mobile-optimized layout, currency formatting with thousands separators, fixed type declarations, improved export functionality
- **v1.1.0** - Initial public release with basic quote generation functionality
- **v1.0.0** - Initial development version

## 🌟 Project Overview

This application streamlines the process of creating custom booking quotes for resort guests. It features a clean, user-friendly interface that allows staff to quickly generate professionally formatted quotes based on guest details and booking information.

## ✨ Features

- **Dynamic Quote Generation**: Create professional resort booking quotes in real-time
- **Dual Input Methods**: Enter data manually or paste formatted data from clipboard
- **Sample Data Option**: Quick testing and demonstration using pre-populated data
- **Real-time Preview**: See the quote update as you enter information
- **Responsive Design**: Works seamlessly on both desktop and mobile devices with optimized layout
- **Mobile-Optimized Layout**: Input form displays above quote preview on mobile devices for better usability
- **Mobile Navigation**: Hamburger menu with smooth animations for better mobile experience
- **Modern Icon System**: Integrated Lucide icons for consistent visual language
- **Localized for Vietnamese**: Full support for Vietnamese language and currency formatting
- **Thousands Separators**: Automatic formatting of price fields for better readability
- **Multi-language Support**: Switch between English and Vietnamese with a simple language selector
- **Performance Monitoring**: Integrated with Vercel Speed Insights for real-time performance analytics
- **Browser Extension Compatible**: Special handling to prevent hydration errors with Grammarly and similar extensions
- **Export Options**: Generate high-quality PNG and PDF versions of quotes

## 💻 Technologies Used

- **Next.js**: React framework for building the UI
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: Modern UI component library
- **date-fns**: For date manipulation and formatting
- **Lucide React**: For beautiful icons
- **Vercel Speed Insights**: For performance monitoring

## 👨‍💻 Developers

### 💻@dltuananh123

**Skills & Contributions:**

- Frontend development with React and Next.js
- UI/UX design implementation
- TypeScript integration
- Form state management and validation
- Internationalization for Vietnamese language

### 🔢@bechovang

**Skills & Contributions:**

- Component architecture design
- Real-time data processing
- Event-based state management
- Custom formatting for currency and dates
- Responsive layout implementation

## 🚀 Key Technical Achievements

- **Custom Event System**: Using CustomEvent for communication between components
- **Intelligent Data Parsing**: Automatic extraction and formatting of pasted tab-separated data
- **Currency Formatting**: Automatic thousands separators for price inputs
- **Date Processing**: Calculation of stay duration and cost based on check-in/check-out dates
- **Advanced State Management**: Efficient form data handling with React hooks
- **Responsive Layout Design**: Optimized user experience on both mobile and desktop devices
- **Custom Type Declarations**: TypeScript type safety for external libraries like dom-to-image
- **Export Functionality**: High-quality PNG and PDF export with multiple quality settings
- **Hydration Error Prevention**: Special handling to accommodate browser extensions like Grammarly

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

The application features a comprehensive translation system with support for English and Vietnamese:

- Translation context provides language switching capabilities
- Language preference is saved to localStorage for persistence between sessions
- All UI elements including navigation, forms, and buttons are fully translated
- Language selection is maintained when refreshing the page

## 💡 Future Enhancements

- Integration with booking systems
- Guest account system
- Quote history and management
- Additional language support
- Analytics dashboard

---

_Developed with ❤️ by [dltuananh123](https://github.com/dltuananh123) and [bechovang](https://github.com/bechovang)_
