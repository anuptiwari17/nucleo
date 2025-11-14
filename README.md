# Nucleo - Employee Management System

*Nucleo* is a full-stack employee and task management web application designed to simplify how organizations manage their teams. It allows organizations to register and onboard admins, create manager roles, assign employees under managers, and track tasks across different stages — from assignment to completion or failure.

Built as a personal project to demonstrate backend, frontend, and database integration using modern web technologies.

## 🌐 Live Website

👉 [Visit Nucleo](https://nucleoorg.vercel.app/)

---

## 🚀 Features

- *Organization Onboarding*
    
    Any organization can register using the admin’s name, email, organization name, and password.
    
- *Admin Dashboard*
    
    Admins can:
    
    - Create and manage managers
    - Add employees under specific managers
    - Assign tasks to employees
    - View task and employee statistics
- *Role-Based Hierarchy*
    - Admin → Managers → Employees
    - Managers manage their own employees
    - Employees can view and update their tasks
- *Task Management System*
    - Tasks can have different statuses: New, Active, Completed, or Failed
    - Failed tasks require a failure reason
- *Public Pages*
    - Pricing page with three tiers (Free, Pro, Enterprise)
    - Legal page with Terms of Service and Privacy Policy
    - Demo scheduling page for feature walkthrough
- *Automatic Page Scroll*
    - ScrollToTop component ensures pages load at the top when navigating between routes
- *Statistics Overview*
    - Real-time analytics on employee count and task breakdown
    - Track how many tasks are new, active, completed, or failed
        - Real-time analytics on employee count and task breakdown
        - Track how many tasks are new, active, completed, or failed
- *Secure Password Handling*
    - All passwords are encrypted using bcrypt before storage
        - All passwords are encrypted using bcrypt before storage

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), TailwindCSS |
| Backend | Express.js |
| Database | PostgreSQL (via Supabase) |
| Hosting | Vercel + Railway |


> Supabase is used purely as a PostgreSQL backend in this project — authentication is handled manually using Express, bcrypt, and sessions.
> 

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/b210955d-1639-4fcb-90f5-10e3bb3a6505)

![image](https://github.com/user-attachments/assets/0c03ba3a-b0c6-4f7f-98d3-ba5bdecabc24)


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

---

---

## 🧪 Local Setup Instructions

> Make sure you have Node.js (v18 or higher) and PostgreSQL (via Supabase or locally) configured.
> 

> 
> 
1. *Clone the repo*
```bash
git clone https://github.com/yourusername/nucleo.git
cd nucleo
```

2. *Setup Environment Variables*
Create a `.env` file in `/backend` with the following:
```dotenv
PORT=5000
DATABASE_URL=your_postgresql_connection_string
KEEP_ALIVE_TOKEN=your_secure_keep_alive_token_here
```

3. *Install dependencies*
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. *Run the App*
```bash
# Terminal 1: Start backend (from backend folder)
npm start

# Terminal 2: Start frontend (from frontend folder)  
npm run dev
```
    

## ✨ Future Improvements

Add Supabase Auth or JWT-based role authentication

Implement file attachments with tasks

Real-time communication using WebSockets

Notifications and alerts for task deadlines

- Add Supabase Auth or JWT-based role authentication
- Implement file attachments with tasks
- Real-time communica# Nucleo - Employee Management System
