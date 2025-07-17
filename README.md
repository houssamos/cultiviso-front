# Cultiviso Front

This repository contains the front-end built with Next.js and Tailwind CSS.

## Environment variables

The application expects a running API. Configure the API base URL with the following variable:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

It is read at runtime to build API requests. Existing calls also use `NEXT_PUBLIC_API_KEY` if your API requires it.

Create a `.env.local` file at the project root to set these variables before running the app.
