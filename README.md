# NJS Mobility - Petrol Bulk Management System

A modern, full-stack petrol bulk management system built with Next.js,
TypeScript, and shadcn/ui components.

## 🚀 Features

### ✅ Authentication System

-  Role-based login (Admin, Manager, Shift Operators)
-  Secure JWT-based authentication
-  User session management

### ✅ Shift Management

-  Create and manage daily shifts (3 shifts per day)
-  Track shift operators and timings
-  Pump reading management
-  Shift checkout with payment reconciliation

### ✅ Fuel Sales Tracking

-  Real-time pump readings (Opening/Closing meters)
-  Automatic calculation of litres sold
-  Support for MS (Motor Spirit) and HSD (High Speed Diesel)
-  Dynamic fuel pricing

### ✅ Store Management

-  Complete inventory system
-  Product management with barcode support
-  POS-style sales interface
-  Low stock alerts
-  Category-wise product organization

### ✅ Payment Processing

-  Multiple payment modes (Cash, Card, UPI)
-  Cash denomination tracking
-  Variance detection and reporting
-  Payment reconciliation

### ✅ Comprehensive Reports

-  Daily, weekly, monthly sales reports
-  Fuel vs Store sales breakdown
-  Payment mode analysis
-  Performance metrics and trends
-  Export functionality (PDF/Excel ready)

### ✅ Modern UI/UX

-  Responsive design (Mobile-first approach)
-  Dark/Light theme support
-  Real-time notifications
-  Intuitive navigation
-  Loading states and error handling

## 🛠️ Tech Stack

### Frontend

-  **Next.js 15** (App Router)
-  **TypeScript** for type safety
-  **Tailwind CSS** for styling
-  **shadcn/ui** for components
-  **TanStack Query** for state management
-  **Zustand** for global state
-  **React Hook Form** with Zod validation

### Backend (Mock Data)

-  **JSON Server** for API simulation
-  **Mock data** for development and testing

### Development Tools

-  **ESLint** for code quality
-  **Prettier** for formatting
-  **Concurrently** for running multiple servers

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard routes
│   ├── login/             # Authentication
│   └── admin/             # Admin-only features
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── dashboard/         # Dashboard components
├── contexts/              # React contexts
│   ├── auth-context.tsx   # Authentication state
│   ├── theme-context.tsx  # Theme management
│   └── sidebar-context.tsx # UI state
├── hooks/                 # Custom React hooks
│   ├── use-shifts.ts      # Shift data management
│   └── use-store.ts       # Store data management
├── lib/                   # Utility functions
│   ├── api-client.ts      # API client
│   ├── query-client.ts    # TanStack Query config
│   └── utils.ts           # Common utilities
├── types/                 # TypeScript interfaces
│   ├── auth.ts            # Authentication types
│   ├── shift.ts           # Shift management types
│   └── store.ts           # Store management types
```

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+
-  npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development servers**

   ```bash
   npm run dev:full
   ```

   This starts both the JSON server (port 3001) and Next.js (port 3000)

3. **Access the application**
   -  Frontend: http://localhost:3000
   -  API (JSON Server): http://localhost:3001

### Demo Credentials

-  **Admin**: `admin@njsmobility.com` (Any password)
-  **Manager**: `manager@njsmobility.com` (Any password)
-  **Operator**: `operator1@njsmobility.com` (Any password)

## 📝 Usage Guide

### 1. **Login**

-  Use any of the demo credentials above
-  System will redirect to dashboard based on user role

### 2. **Dashboard Overview**

-  View daily sales summary
-  Check ongoing shifts
-  Monitor low stock alerts
-  Access quick actions

### 3. **Shift Management**

-  **Create New Shift**: Start tracking for a new shift
-  **Record Readings**: Enter pump opening/closing readings
-  **Process Payments**: Record cash, card, UPI payments
-  **Close Shift**: Complete shift with reconciliation

### 4. **Store Sales**

-  **Add Products**: Manage inventory items
-  **Process Sales**: POS-style sales interface
-  **Track Stock**: Monitor inventory levels
-  **View Reports**: Sales performance analysis

### 5. **Reports & Analytics**

-  **Daily Reports**: Comprehensive day-wise analysis
-  **Fuel Analytics**: Pump performance and fuel type breakdown
-  **Store Metrics**: Product sales and inventory insights
-  **Payment Analysis**: Payment mode preferences

## 🎯 Key Features Highlight

### Role-Based Access Control

-  **Admin**: Full system access, user management, fuel price updates
-  **Manager**: Operations oversight, reports, inventory management
-  **Operators**: Shift operations, fuel readings, store sales

### Real-time Data Sync

-  TanStack Query provides automatic background updates
-  Optimistic updates for better UX
-  Error boundary handling

### Modern UI Patterns

-  Sidebar navigation with collapse/expand
-  Theme switching (Dark/Light mode)
-  Toast notifications for user feedback
-  Loading skeletons and states
-  Mobile-responsive design

### Data Validation

-  Form validation with Zod schemas
-  Type-safe API interactions
-  Error handling and user feedback

## 🔧 Development Scripts

```bash
# Start both JSON server and Next.js
npm run dev:full

# Start only Next.js
npm run dev

# Start only JSON server
npm run json-server

# Build for production
npm run build

# Run linting
npm run lint
```

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
