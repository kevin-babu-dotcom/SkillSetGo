# SkillSetGo

A comprehensive online testing and assessment platform for students and educational institutions, built with modern web technologies.

## Overview

SkillSetGo is a full-stack application designed to facilitate skill assessment and testing. The platform supports both individual students and institutions, providing features for test creation, management, progress tracking, and payment processing.

## Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org) with React 19
- **Styling**: Tailwind CSS 4 with PostCSS
- **Backend/Database**: [Firebase](https://firebase.google.com) & Firebase Admin SDK
- **Authentication**: Firebase Auth with OTP verification
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Payments**: Razorpay integration
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons

## Key Features

- **User Authentication**: Phone-based OTP verification and login flow
- **Role-Based Access**: Separate dashboards for students, institutions, and admins
- **Test Management**: Create, manage, and publish tests
- **Progress Tracking**: Real-time student progress monitoring
- **Payment Integration**: Razorpay payment gateway for subscriptions and test fees
- **Profile Management**: Comprehensive user profile setup with education stage and interests
- **Responsive Design**: Mobile-optimized interface using Tailwind CSS

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (admin)/           # Admin dashboard routes
│   ├── (auth)/            # Authentication routes (login, signup, verify-phone)
│   ├── (dashboard)/       # User dashboards (student, institution)
│   ├── (legal)/           # Legal pages (privacy, terms, refund)
│   ├── (public)/          # Public pages (about, pricing, resources)
│   ├── api/               # API routes
│   ├── profile/           # Profile setup and management
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components (navbar, footer)
├── firebase/             # Firebase configuration and setup
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
└── store/               # Zustand stores (auth, profile)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project setup (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
- Razorpay account for payment processing
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SkillSetGo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory with your Firebase and Razorpay credentials.

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build and Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Firebase configuration and deployment
- [Authentication Reference](./AUTH_REFERENCE.md) - Authentication flow details
- [Login Flow Diagram](./LOGIN_FLOW.md) - Visual representation of login process
- [Signup Flow Diagram](./NEW_SIGNUP_FLOW.md) - Visual representation of signup process
- [Flow Diagrams](./FLOW_DIAGRAMS.md) - Overall application flow diagrams
- [Setup Completion Notes](./SETUP_COMPLETE.md) - Setup checklist and notes

## API Routes

Key API endpoints:
- `/api/auth/send-otp` - Send OTP for phone verification
- `/api/auth/verify-otp` - Verify OTP and authenticate user
- `/api/auth/refresh` - Refresh authentication token
- `/api/user/profile` - User profile endpoints
- `/api/tests` - Test management endpoints
- `/api/admin/` - Admin management routes
- `/api/payments/verify` - Payment verification
- `/api/verify-payment` - Payment confirmation
- `/api/create-order` - Create Razorpay payment order
- `/api/webhooks/razorpay` - Razorpay webhook handler

## Environment Setup

For detailed setup instructions, refer to [SETUP_COMPLETE.md](./SETUP_COMPLETE.md).

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## License

This project is private and proprietary.

## Support

For issues, questions, or suggestions, please refer to the documentation files or contact the development team.
