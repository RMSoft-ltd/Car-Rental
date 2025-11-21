# 🚗 Car Rental Platform

A modern, full-featured car rental platform built with Next.js 15, TypeScript, and Tailwind CSS. This application enables users to search, book, and manage car rentals while providing car owners with comprehensive dashboard tools for listing and managing their vehicles.

## ✨ Features

### For Renters
- 🔍 **Advanced Search & Filtering**: Search cars by location, date, price range, features, and more
- 📅 **Date Selection**: Pick-up and drop-off date selection with availability checking
- 🛒 **Shopping Cart**: Add multiple cars to cart and manage bookings
- 💳 **Payment Integration**: Secure payment processing for bookings
- 📱 **Real-time Notifications**: Get instant updates on bookings and messages
- ⭐ **Reviews & Ratings**: View and submit reviews for rental experiences
- 📊 **Booking Management**: Track booking history and status
- 🔐 **Authentication**: Secure sign-in/sign-up with email verification and two-factor authentication

### For Car Owners
- 📝 **Car Listing Management**: Create, edit, and manage car listings with rich details
- 📸 **Image Upload**: Multiple image uploads for car galleries
- 📅 **Booking Calendar**: Visual calendar view of bookings and availability
- 💰 **Payment Tracking**: Monitor payments and earnings
- 📈 **Analytics Dashboard**: View booking statistics and performance metrics
- 🔔 **Notification System**: Real-time notifications for bookings and messages
- ⚙️ **Settings Management**: Profile, billing, security, and notification settings

### General Features
- 🎨 **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- 🌐 **Real-time Updates**: Socket.io integration for live updates
- 📍 **Location Services**: Google Maps integration for location picking
- 🔒 **Secure Authentication**: JWT-based authentication with refresh tokens
- 📱 **Mobile Responsive**: Fully responsive design for all devices
- ⚡ **Performance Optimized**: Built with Next.js 15 App Router for optimal performance

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15.5.3](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)

### State Management & Data Fetching
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State**: React Context API

### Real-time & Communication
- **WebSockets**: [Socket.io Client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### UI Libraries & Tools
- **Icons**: [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/)
- **Calendar**: [FullCalendar](https://fullcalendar.io/)
- **Date Handling**: [date-fns](https://date-fns.org/) + [dayjs](https://day.js.org/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Development Tools
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/pnpm/yarn/bun

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Car-Rental
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5003/api
# or your production API URL
# NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api

# Authentication Token Keys
NEXT_PUBLIC_TOKEN_KEY=car_rental_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=car_rental_refresh_token

# Google Maps API Key (if using location services)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Car-Rental/
├── public/                 # Static assets
│   ├── audio/             # Audio files
│   └── images/           # Image assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # Authentication pages
│   │   ├── booking/       # Booking pages
│   │   ├── cars/          # Car listing pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout process
│   │   ├── dashboard/     # User dashboard
│   │   └── profile/       # User profile
│   ├── components/        # React components
│   │   ├── auth/          # Auth-related components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── forms/         # Form components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI component library
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── components.json        # shadcn/ui configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔑 Key Features Breakdown

### Authentication System
- Email/password authentication
- Email verification
- Password reset functionality
- Two-factor authentication (2FA)
- JWT token management with refresh tokens
- Protected routes

### Car Search & Discovery
- Advanced filtering (price, year, features, location)
- Sort options (price, rating, date)
- Real-time availability checking
- Car detail pages with galleries
- Host information and reviews

### Booking System
- Date range selection
- Availability validation
- Shopping cart functionality
- Direct booking option
- Booking confirmation and tracking
- Booking history

### Dashboard Features
- **For Renters**: Booking history, payment tracking, profile management
- **For Owners**: Car listings, booking calendar, payment management, analytics

### Payment Integration
- Payment request processing
- Payment status tracking
- Transaction history

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Next.js Configuration
The project is configured in `next.config.ts` with:
- Image optimization for remote patterns
- File tracing for deployment

### API Client
The API client (`src/lib/api.ts`) includes:
- Automatic token injection
- Request/response interceptors
- Error handling for 401 (unauthorized) responses
- Automatic redirect to sign-in on token expiration

## 🌐 API Integration

The application communicates with a REST API. Ensure your backend API is running and accessible at the URL specified in `NEXT_PUBLIC_API_BASE_URL`.

### API Endpoints Used
- `/auth/*` - Authentication endpoints
- `/car-booking/*` - Booking and cart management
- `/car-listing/*` - Car listing management
- `/payment/*` - Payment processing
- `/users/*` - User management
- `/notifications/*` - Notification system

## 🎨 UI Components

The project uses a combination of:
- **Radix UI** primitives for accessible components
- **shadcn/ui** for pre-built component patterns
- **Tailwind CSS** for styling
- Custom components in `src/components/ui/`

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT-based authentication
- Secure token storage in localStorage
- Automatic token refresh
- Protected API routes
- Input validation with Zod
- XSS protection with DOMPurify

## 🚧 Development Notes

- The application uses Next.js 15 App Router
- All components are client-side by default (`"use client"`)
- TypeScript strict mode is enabled
- ESLint is configured with Next.js recommended rules

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
