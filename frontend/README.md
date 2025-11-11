# LocalCode Frontend

React + Vite frontend application for LocalCode.

## Technology Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Monaco Editor** - Code editor component

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout.jsx   # Main layout with navigation
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProblemList.jsx
│   ├── ProblemDetail.jsx
│   ├── SubmissionHistory.jsx
│   └── Dashboard.jsx
├── config/          # Configuration files
│   └── api.js       # API endpoints and base URL
├── App.jsx          # Main app component with routing
├── main.jsx         # Application entry point
└── index.css        # Global styles with Tailwind
```

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env.development` and `.env.production` files:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Implemented (Task 3)

- ✅ Vite + React project setup
- ✅ React Router for navigation
- ✅ Tailwind CSS with custom theme
- ✅ Basic page structure and routing
- ✅ Environment configuration for API
- ✅ Layout component with navigation
- ✅ Placeholder pages for main routes

### To Be Implemented

- Authentication UI and context
- Problem browsing and filtering
- Code editor integration
- Test case management
- Submission history
- Dashboard with statistics

## Routing Structure

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/problems` - Problem list
- `/problems/:id` - Problem detail with code editor
- `/submissions` - Submission history
- `/dashboard` - User dashboard

## Tailwind Custom Theme

Custom colors defined in `tailwind.config.js`:

- **Primary**: Blue color palette for main actions
- **Success**: Green for successful submissions
- **Error**: Red for errors
- **Warning**: Orange for warnings

Custom component classes:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Form input style
- `.card` - Card container style

## API Integration

API configuration is centralized in `src/config/api.js` with:

- Base URL from environment variables
- Endpoint constants for all API routes
- Easy to maintain and update

## Next Steps

Refer to the implementation plan in `.kiro/specs/localcode/tasks.md` for upcoming tasks:

- Task 12: Implement authentication UI components
- Task 13: Implement problem browsing UI
- Task 14: Implement problem solving interface
- Task 15: Implement custom test case UI
- Task 16: Implement submission history UI
- Task 17: Implement API service layer
