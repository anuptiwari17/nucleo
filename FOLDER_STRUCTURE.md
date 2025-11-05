# Project folder structure — `nucleo`

This file lists the project files and folders with short, practical explanations of what they are and where to edit them. Use this as a quick reference while developing or onboarding contributors.

---

## Top-level folders

- `frontend/` 
  Contains the complete React frontend application
- `backend/`
  Contains the Express.js API server
- `public/`
  Static assets used by the frontend

## Frontend folder (`frontend/`)

### Root configuration files

- `frontend/README.md`
  - Frontend setup and development instructions.
- `frontend/package.json`
  - Frontend project manifest (Vite + React). Contains scripts like `dev`, `build`, and dependencies used by the client code.
- `frontend/vite.config.js`
  - Vite build/dev server configuration. Edit to customize dev server, aliases or build options.
- `frontend/index.html`
  - Root HTML file used by Vite + React app. Edit global head elements, meta tags, or include external fonts/styles.
- `frontend/eslint.config.js`
  - ESLint configuration for linting rules. Edit if you want to change lint rules or integrate with IDEs.
- `frontend/postcss.config.js`
  - PostCSS configuration (used with Tailwind). Edit to change PostCSS plugins or options.
- `frontend/tailwind.config.js`
  - Tailwind CSS config (theme, plugin settings). Edit to change design tokens, colors, spacing, etc.

## `backend/` (Express API)

- `backend/package.json`
  - Backend npm manifest: lists Express, bcrypt, pg, dotenv, etc. Start the backend with `npm start` inside this folder.
- `backend/index.js`
  - Main server entrypoint for the Express API.
  - What it serves: mounts routes, sets up middlewares (CORS, body parsing), and starts the HTTP server.
  - Where to edit: add new endpoints, middleware, auth logic, or change listen port.
- `backend/db.js`
  - Database connection wrapper (Supabase/Postgres URL via `SUPABASE_DB_URL` env var or similar). Exports the DB client used by the app.
  - Where to edit: change connection pooling settings, queries helper functions, or replace with another DB client.

### `backend/routes/`
- `backend/routes/auth.js`
  - Authentication endpoints (signup/login/logout, password handling). Uses `bcrypt` to hash passwords.
  - Where to edit: change auth flow, add session/JWT support, or wire to Supabase Auth.
- `backend/routes/userRoutes.js`
  - User management endpoints (create/update users, role assignment). Admin-related user CRUD likely here.
  - Where to edit: change user schema handling, validation, or access control.
- `backend/routes/tasksRoutes.js`
  - Task-related endpoints (create tasks, update status, list tasks by role/manager/employee).
  - Where to edit: add filtering, validation, or new task actions (assign, reassign, add comments, attach files).

> Note: Backend expects environment variables (see `README.md`): create `.env` in `backend/` with `PORT` and `SUPABASE_DB_URL` (or your Postgres connection string). If you extend auth, you may add JWT secret or session config.

## `public/`
- Static public assets consumed by the frontend (images, manifest, etc.). Served directly by Vite in dev or bundled in production.
- Where to edit: add global images, icons, or static assets referenced by `index.html`.

## Frontend Source (`frontend/src/`)

- `frontend/src/main.jsx`
  - App bootstrap: mounts React app into DOM, wraps providers (router, contexts), and applies global CSS.
  - Where to edit: change app-wide providers or switch root rendering options.
- `frontend/src/index.css` and `frontend/src/App.css`
  - Global styles and any component-scoped CSS imports. Tailwind base utilities are usually imported here.
  - Where to edit: global styling, theme overrides, or component-specific CSS if not using Tailwind fully.
- `frontend/src/App.jsx`
  - Top-level React component: configures routes and high-level layout.
  - Where to edit: modify global app routes, layout wrappers or add global components.

### `frontend/src/components/`
Contains presentational and page components used by the app.

- `frontend/src/components/LandingPage.jsx`
  - Public landing/home page for the app.
- `frontend/src/components/ui/Header.jsx`
  - App header/navigation component used across pages. Edit to change menus, logo, or links.

#### `frontend/src/components/Auth/`
- `Login.jsx`
  - Login page and form. Edit to change login UX or fields.
- `Signup.jsx`
  - Signup (organization onboarding) page. Includes admin name, email, org name, password.
- `ForgotPassword.jsx`
  - Password reset request/update UI.

#### `frontend/src/components/Dashboard/`
- `AdminDashboard.jsx`
  - Admin-facing dashboard UI: create managers/employees, statistics, assign tasks.
- `ManagerDashboard.jsx`
  - Manager-facing dashboard: manage their employees, assign tasks, view reports.
- `EmployeeDashboard.jsx`
  - Employee-facing dashboard: view assigned tasks, update status (Accept/Complete/Fail).

#### `frontend/src/components/TaskList/`
- `NewTask.jsx`
  - UI to create a new task.
- `AcceptTask.jsx`, `CompleteTask.jsx`, `FailedTask.jsx`
  - Task action components for changing task status and optionally adding failure reasons.

### `frontend/src/context/`
- `AuthContext.jsx`
  - React context provider for authentication state and helper methods (login, logout, current user).
  - Where to edit: add role-check helpers, persist sessions, or integrate with JWT/Supabase Auth.

### `frontend/src/routes/`
- `AppRoutes.jsx`
  - Route definitions for public and protected routes.
- `PrivateRoute.jsx`
  - Route guard component that checks authentication (and possibly role) before rendering protected pages.
  - Where to edit: change redirect path, add role-based checks, or loading behavior.

### `frontend/src/utils/`
- `localStorage.jsx`
  - Utility wrappers for storing tokens or user info in `localStorage` and retrieving them.
  - Where to edit: switch to sessionStorage, secure storage, or encryption.

---

## Quick mapping: who edits what

- Frontend UI and routing: edit files in `frontend/src/` (components, routes, context, utils).
- Styling and design tokens: `frontend/tailwind.config.js`, `frontend/src/index.css`, `frontend/src/App.css`.
- Backend API and DB: edit `backend/index.js`, `backend/db.js`, and files in `backend/routes/`.
- Environment: add `.env` in `backend/` (DB URL, PORT). Frontend environment variables (if needed) go in the project root `.env` files handled by Vite.

## Why this structure?

- Separation of concerns: `frontend/src/` contains a self-contained React client while `backend/` is a small Express API.
- Each area grouped by feature (Auth, Dashboard, TaskList) keeps component responsibilities clear.
- `context/` and `utils/` centralize cross-cutting logic, making components simpler and easier to test.

