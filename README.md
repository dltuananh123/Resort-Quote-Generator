# Resort Quote Generator

A modern, elegant web application for generating professional resort booking quotes for Asteria Mũi Né Resort.

## 🌟 Project Overview

This application streamlines the process of creating custom booking quotes for resort guests. It features a clean, user-friendly interface that allows staff to quickly generate professionally formatted quotes based on guest details and booking information.

## ✨ Features

- **Dynamic Quote Generation**: Create professional resort booking quotes in real-time
- **Dual Input Methods**: Enter data manually or paste formatted data from clipboard
- **Sample Data Option**: Quick testing and demonstration using pre-populated data
- **Real-time Preview**: See the quote update as you enter information
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Localized for Vietnamese**: Full support for Vietnamese language and currency formatting

## 💻 Technologies Used

- **Next.js**: React framework for building the UI
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: Modern UI component library
- **date-fns**: For date manipulation and formatting
- **Lucide React**: For beautiful icons

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

## 📐 Favicon Setup

The application is configured to use a custom favicon:

1. The main favicon file is `public/favicon.svg`
2. The application is set up to support multiple favicon formats:
   - SVG: `/favicon.svg` (vector format, best for modern browsers)
   - ICO: `/favicon.ico` (traditional format, for older browsers)
   - PNG: Various sizes in `/favicon-*x*.png` (for different devices)

### Generating Favicon Files

The project includes a script to generate all required favicon formats from your SVG:

```bash
# Install ImageMagick first (required for conversion)
# - Windows: https://imagemagick.org/script/download.php
# - Mac: brew install imagemagick
# - Ubuntu/Debian: sudo apt-get install imagemagick

# Then run the generation script
npm run generate-favicon
```

If you don't have ImageMagick installed, you can manually create the favicon files using online tools like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/).

## 💡 Future Enhancements

- PDF export functionality
- Email integration for sending quotes directly to guests
- Multi-language support
- Dark mode theme
- Integration with booking systems

---

_Developed with ❤️ by dltuananh123 and bechovang_
