# Nucleo - Employee Management System

**Nucleo** is a full-stack employee and task management web application designed to simplify how organizations manage their teams. It allows organizations to register and onboard admins, create manager roles, assign employees under managers, and track tasks across different stages — from assignment to completion or failure.

Built as a personal project to demonstrate backend, frontend, and database integration using modern web technologies.

## 🌐 Live Website

👉 [Visit Nucleo](https://nucleoorg.vercel.app/)

---

## 🚀 Features

- **Organization Onboarding**
    
    Any organization can register using the admin’s name, email, organization name, and password.
    
- **Admin Dashboard**
    
    Admins can:
    
    - Create and manage managers
    - Add employees under specific managers
    - Assign tasks to employees
    - View task and employee statistics
- **Role-Based Hierarchy**
    - Admin → Managers → Employees
    - Managers manage their own employees
    - Employees can view and update their tasks
- **Organization Onboarding**
Any organization can register using the admin’s name, email, organization name, and password.
- **Admin Dashboard**
Admins can:
    - Create and manage managers
    - Add employees under specific managers
    - Assign tasks to employees
    - View task and employee statistics
- **Role-Based Hierarchy**
    - Admin → Managers → Employees
    - Managers manage their own employees
    - Employees can view and update their tasks
- **Task Management System**
    - Tasks can have different statuses: `New`, `Active`, `Completed`, or `Failed`
    - Failed tasks require a failure reason
        - Tasks can have different statuses: `New`, `Active`, `Completed`, or `Failed`
        - Failed tasks require a failure reason
- **Statistics Overview**
    - Real-time analytics on employee count and task breakdown
    - Track how many tasks are new, active, completed, or failed
        - Real-time analytics on employee count and task breakdown
        - Track how many tasks are new, active, completed, or failed
- **Secure Password Handling**
    - All passwords are encrypted using `bcrypt` before storage
        - All passwords are encrypted using `bcrypt` before storage

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), TailwindCSS |
| Backend | Express.js |
| Database | PostgreSQL (via Supabase) |
| Hosting | Vercel |
| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), TailwindCSS |
| Backend | Express.js |
| Database | PostgreSQL (via Supabase) |
| Hosting | Vercel |

Export to Sheets

> Supabase is used purely as a PostgreSQL backend in this project — authentication is handled manually using Express, bcrypt, and sessions.
> 

---

## 📸 Screenshots

(To be added)

(To be added)

## 📁 Project Structure (Simplified)

nucleo/

`nucleo/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Page components (Home, Dashboard, etc.)
│ │ └── utils/ # Helper functions, API utils
│
├── backed/ # Express backend
├── backend/ # Express backend
│ ├── routes/ # Auth, User, Task API
│ ├── db/ # Supabase (PostgreSQL) connection
│ └── db/ # Supabase (PostgreSQL) connection
│
└── [README.md](http://readme.md/) # You're here!

└── [README.md](http://readme.md/) # You're here!`

---

---

## 🧪 Local Setup Instructions

> Make sure you have Node.js (v18 or higher) and PostgreSQL (via Supabase or locally) configured.
> 

> 
> 
1. **Clone the repo**

```bash
git clone <https://github.com/yourusername/nucleo.git>
cd nucleo

```

1. *Setup Environment Variables
Create a .env file in /backend
PORT=5000
SUPABASE_DB_URL=your_supabase_postgresql_url
2. Install dependencies :
npm install
`cd /backend`
npm install
3. Run the App
npm start
`cd ..`
npm run dev

Bash

`git clone <https://github.com/yourusername/nucleo.git> cd nucleo`

1. **Setup Environment Variables**
Create a `.env` file in `/backend`
    
    `PORT=5000  SUPABASE_DB_URL=your_supabase_postgresql_url`
    
2. **Install dependencies**Bash
    
    `npm install  cd backend  npm install`
    
3. **Run the App**Bash
    
    `npm start  cd ..  npm run dev`
    

## ✨ Future Improvements

Add Supabase Auth or JWT-based role authentication

Implement file attachments with tasks

Real-time communication using WebSockets

Notifications and alerts for task deadlines

- Add Supabase Auth or JWT-based role authentication
- Implement file attachments with tasks
- Real-time communication using WebSockets
- Notifications and alerts for task deadlines