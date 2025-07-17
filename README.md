# Cultiviso Front

This project provides the Next.js and Tailwind CSS front-end for the Cultiviso application. It communicates with a separate API to display and manage data.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment variables

Create a `.env.local` file in the project root and set these variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=your_api_key_if_required
```

These values are read at runtime to build API requests.
