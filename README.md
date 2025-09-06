# Nirva Yoga Studio

A modern virtual yoga studio website built with React, TypeScript, and Tailwind CSS. Features class booking, user authentication, payment processing via Zelle, and an admin panel.

## 🧘‍♀️ Features

- **Virtual Class Bookings** - Schedule and book yoga classes online
- **User Authentication** - Secure login and account management
- **Class Packages** - 5-class and 10-class discount packages
- **Zelle Payments** - Secure payment processing without transaction fees
- **Admin Panel** - Class management and user administration
- **Responsive Design** - Works on desktop and mobile devices
- **SEO Optimized** - Proper meta tags and structured data

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. Set build command to `npm run build`
4. Set publish directory to `dist`
5. Deploy!

### Manual Deployment

You can also deploy manually:

1. Run `npm run build`
2. Drag and drop the `dist` folder to Netlify's deploy interface

## 🔧 Configuration

### Environment Variables

For production, you may need to set up environment variables for:
- Supabase configuration (if using backend features)
- Any API keys

### Domain Setup

To use with your custom domain (nirvayogastudio.com):
1. Add your domain in Netlify's domain settings
2. Update DNS records to point to Netlify
3. SSL certificate will be automatically provisioned

## 📱 Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons

## 🛡️ Security Features

- XSS Protection headers
- Frame options for clickjacking prevention
- Secure referrer policy
- Content Security Policy ready

## 📄 Pages

- **Home** - Hero section with class information
- **Classes** - Schedule and booking interface
- **Teachers** - Instructor profiles and specialties
- **Packages** - Class package options and pricing
- **Contact** - Contact form and studio information
- **FAQ** - Frequently asked questions
- **Admin** - Administrative panel for class management

## 💳 Payment System

Uses Zelle for payments to avoid credit card transaction fees:
- Instant payments through banking apps
- No processing fees
- Secure bank-to-bank transfers
- Payment phone: +1 (805) 807-4894

## 📞 Support

For questions about the website, contact the development team or visit the FAQ section.

## 📋 License

This project is private and proprietary to Nirva Yoga Studio.