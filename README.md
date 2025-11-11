# CRM Frontend

A modern Customer Relationship Management (CRM) application built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **React Query (TanStack Query)** - Data fetching and state management
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Playwright** - End-to-end testing

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (or npm/yarn)
- **Backend API Server** - The application requires a running backend API

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd crm-frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following content:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** Replace `http://localhost:3000/api` with your actual backend API URL.

### 4. Start the backend API server

Make sure your backend API server is running and accessible at the URL specified in `VITE_API_URL`.

## Running the Application

### Development Mode

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build for Production

Build the application for production:

```bash
pnpm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
pnpm run preview
```

## Running E2E Tests

The project uses Playwright for end-to-end testing. All tests interact with the **real API** (no mocks).

### Prerequisites for E2E Tests

1. **Backend API must be running** - Tests require a live backend server
2. **API URL configured** - Ensure `VITE_API_URL` in `.env` matches your backend URL
3. **Database setup** - Your backend database should be accessible

### Run All E2E Tests

```bash
pnpm run test:e2e
```

### Run Specific Test Files

```bash
# Run customer list tests
pnpm run test:e2e tests/customer-list.spec.ts

# Run add customer tests
pnpm run test:e2e tests/add-customer.spec.ts

# Run update customer tests
pnpm run test:e2e tests/update-customer.spec.ts

# Run delete customer tests
pnpm run test:e2e tests/delete-customer.spec.ts
```

### View Test Report

After running tests, a HTML report is automatically generated. To view it:

```bash
npx playwright show-report
```
