# Slooze Frontend

Frontend application for the Slooze food delivery platform.

This app provides:
- Login screen with role-based demo users
- Restaurant listing and restaurant details views
- Cart and orders screens
- Protected dashboard routing based on auth state

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toasts/notifications

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running at `http://localhost:4000`

## Setup and Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start Next.js in development mode
- `npm run build` - Build production assets
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks

## Libraries Used

### Runtime dependencies

- `next`
- `react`
- `react-dom`
- `clsx`
- `tailwind-merge`
- `framer-motion`
- `lucide-react`
- `sonner`

### Development dependencies

- `typescript`
- `eslint`
- `eslint-config-next`
- `tailwindcss`
- `@tailwindcss/postcss`
- `@types/node`
- `@types/react`
- `@types/react-dom`
