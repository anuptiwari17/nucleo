# Backend — Nucleo (Express API)

This folder contains the Express-based API used by the Nucleo application.

Contents
- `index.js` — server entrypoint (mounts routes and starts HTTP server)
- `db.js` — Postgres (pg) connection pool (reads `DATABASE_URL` from env)
- `routes/` — API route modules (`auth.js`, `userRoutes.js`, `tasksRoutes.js`)

Quick start

1. Create a `.env` file in this folder (you can copy `.env.example`).
2. Install dependencies and start the server:

```powershell
cd backend
npm install
npm start
```

Port and DB connection
- `PORT` — port the server listens on (e.g. `5000`).
- `DATABASE_URL` — Postgres connection string (e.g. `postgres://user:pass@host:5432/dbname`).

If you use Supabase as Postgres, paste the full connection string. `db.js` enables SSL with `rejectUnauthorized: false` for Supabase compatibility.

.env example
See `./.env.example` in this folder for a template.

API overview
Base paths mounted in `index.js`:
- `/auth` → routes in `routes/auth.js`
- `/users` → routes in `routes/userRoutes.js`
- `/tasks` → routes in `routes/tasksRoutes.js`

Below are the primary endpoints, request shapes and short notes. This is a lightweight reference — for production consider adding OpenAPI/Swagger.

Authentication (`routes/auth.js`)

- POST /auth/login
  - Body: { email, password }
  - Returns: { id, full_name, role, organization_id } on success.
  - Notes: verifies password with bcrypt against `users.password_hash`.

- POST /auth/signup
  - Body: { firstName, lastName, email, password, organizationName, role }
  - Creates an organization row and a user in a single DB transaction.
  - Returns: created user metadata and message.

- POST /auth/forgot-password
  - Body: { email }
  - Currently a placeholder: returns a success message but does not send email. See comment in file for next steps (use nodemailer or a third-party service).

User management (`routes/userRoutes.js`)

- GET /users/
  - Returns: list of all users (admin / dev use).

- POST /users/create-manager
  - Body: { full_name, email, department, password?, organization_id }
  - Creates a user with role `manager`. Password falls back to `manager123` if not provided.

- POST /users/create-employee
  - Body: { full_name, email, position, password?, manager_id, organization_id }
  - Creates a user with role `employee`. Password falls back to `emp123` if not provided.

- GET /users/manager/:managerId
  - Returns users where `manager_id = :managerId` (employees under a manager).

- GET /users/managers/:organizationId
  - Returns list of managers in an organization plus an `employee_count` per manager.

- GET /users/employees/:organizationId?manager_id=xxx
  - Returns employees for an organization; optional query `manager_id` to filter by manager.

Task management (`routes/tasksRoutes.js`)

- GET /tasks/manager/:managerId
  - Fetch tasks assigned by a manager.

- POST /tasks/assign
  - Body: { title, description?, priority (low|medium|high), due_date, assigned_by, assigned_to, organization_id }
  - Creates a new task and inserts a `task_logs` entry with action `created`.

- GET /tasks/logs/organization/:organizationId
  - Returns `task_logs` entries for an organization (joined with tasks and users).

- GET /tasks/employee/:employeeId?status=...
  - Returns tasks assigned to an employee. Optional `status` filter (`new`, `accepted`, `completed`, `failed`).

- PUT /tasks/:taskId/accept
  - Body: { user_id }
  - Marks the task `accepted` (only if status = `new`) and logs the action.

- PUT /tasks/:taskId/complete
  - Body: { user_id, note? }
  - Marks the task `completed` (only if status = `accepted`) and logs the action.

- PUT /tasks/:taskId/fail
  - Body: { user_id, reason }
  - Marks the task `failed` with `reason_failed` and logs the action.

- GET /tasks/stats/organization/:organizationId
  - Returns aggregated task stats for an organization (counts by status & priority).

- GET /tasks/stats/employee/:employeeId
  - Returns aggregated stats for a specific employee.

- DELETE /tasks/:taskId
  - Body: { manager_id }
  - Deletes a task if it belongs to the given manager (manager-only action).

- GET /tasks/organization/:organizationId
  - Returns all tasks for an organization along with assigned_by / assigned_to names.

Notes & next steps

- API docs: I added a concise reference here. If you want formal API docs I can add an OpenAPI (swagger) spec (a small `openapi.yaml`) and a lightweight route to serve Swagger UI. That typically involves adding one dev dependency (e.g., `swagger-ui-express`) and a JSON/YAML file describing endpoints.

- Security: endpoints currently trust request bodies for authorization (e.g., `manager_id` or `user_id` passed in body). For production add authentication (JWT or session) and server-side authorization checks.

- Testing: consider adding a small test harness (Jest + supertest) to verify critical endpoints.

If you'd like I can:
- Add an `openapi.yaml` in `backend/` and wire `swagger-ui-express` to serve it at `/docs`.
- Add `backend/.env.example` (already created alongside this README).
- Add a short `backend/POSTMAN_COLLECTION.json` if you prefer Postman.

---

Last updated: autogenerated from code (routes) — edit this file if you add/change endpoints.
