# LocalCode Frontend

The React app where users browse problems, write code, and submit solutions.

## What's in here

This is a single-page app built with React and Vite. It talks to the Spring Boot backend for everything — authentication, fetching problems, submitting code, getting results.

The code editor is Monaco (the same one VS Code uses), so you get syntax highlighting, autocomplete, and all the nice things you'd expect.

## Project structure

```
src/
├── components/
│   ├── common/              # Buttons, cards, badges
│   ├── home/                # Homepage components
│   ├── problems/            # Problem list, filters, search
│   └── problem-detail/      # Code editor, test results, submissions
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login form
│   ├── Register.jsx         # Registration form
│   ├── ProblemList.jsx      # Browse all problems
│   ├── ProblemDetail.jsx    # Solve a problem
│   ├── SubmissionHistory.jsx # Past submissions
│   ├── SubmissionDetail.jsx # Single submission details
│   └── Dashboard.jsx        # User stats
├── services/                # API calls
├── contexts/                # Auth context
├── config/                  # API configuration
├── styles/                  # Editor theme, etc.
└── utils/                   # Helper functions
```

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

The app expects the backend to be running at `http://localhost:8080/api`. If your backend is elsewhere, create a `.env.development` file:

```
VITE_API_BASE_URL=http://your-backend-url/api
```

## Available scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm run test     # Run tests in watch mode
npm run test:run # Run tests once
npm run test:ui  # Run tests with Vitest UI
```

## Pages and routes

| Route | Page | Auth required |
|-------|------|---------------|
| `/` | Home | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/problems` | Problem list | Yes |
| `/problems/:id` | Problem detail | Yes |
| `/submissions` | Submission history | Yes |
| `/submissions/:id` | Submission detail | Yes |
| `/dashboard` | User dashboard | Yes |
| `/showcase` | Component showcase | No |

Protected routes redirect to login if you're not authenticated.

## Features

**Problem browsing**
- Filter by difficulty (Easy, Medium, Hard)
- Filter by status (Solved, Attempted, Todo)
- Search by title
- See acceptance rates

**Code editor**
- Monaco Editor with syntax highlighting
- Language selector (Java, Python, JavaScript)
- Starter code templates
- Custom test cases

**Submissions**
- Real-time test results
- See which test cases passed/failed
- View past submissions
- Compare different attempts

**Dashboard**
- Problems solved by difficulty
- Recent submissions
- Overall progress

## Styling

We use Tailwind CSS. The config is in `tailwind.config.js`.

Custom colors follow a consistent theme:
- Primary: Blue tones for main actions
- Success: Green for passed tests
- Error: Red for failures
- Warning: Orange for timeouts, etc.

The Monaco editor has a custom dark theme defined in `src/styles/editor-theme.js`.

## API integration

All API calls go through the services in `src/services/`:

- `authService.js` — Login, register, token management
- `problemService.js` — Fetch problems
- `submissionService.js` — Submit code, get results
- `testCaseService.js` — Custom test cases

The base URL comes from `src/config/api.js`, which reads from environment variables.

## Authentication

Auth state lives in `src/contexts/AuthContext.jsx`. It:
- Stores the JWT token in localStorage
- Provides `login`, `logout`, `register` functions
- Exposes `user` and `isAuthenticated` to components

The `ProtectedRoute` component wraps routes that require authentication.

## Testing

Tests use Vitest and React Testing Library. Run them with:

```bash
npm run test
```

Test files live next to the components they test (e.g., `Button.jsx` and `Button.test.jsx`).

## Building for production

```bash
npm run build
```

Output goes to `dist/`. The build is optimized and minified.

For production, set `VITE_API_BASE_URL` in `.env.production` to point to your backend.

## Tech stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- Monaco Editor
- Axios
- React Query (TanStack Query)
- Vitest + React Testing Library

## Troubleshooting

**"Network Error" on API calls**

The backend isn't running or CORS is blocking requests. Make sure:
1. Backend is running at the URL in your `.env` file
2. Backend CORS config allows your frontend origin

**Monaco editor not loading**

This sometimes happens with hot reload. Refresh the page.

**Tests failing with "document is not defined"**

Make sure `jsdom` is configured in `vitest.config.js`. It should be set up already.
