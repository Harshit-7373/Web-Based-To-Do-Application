# 🧠 Web-Based Collaborative To-Do Board Application

A real-time, web-based collaborative task management app inspired by Trello. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), this tool enables multiple users to manage tasks, collaborate live, and track activity seamlessly. No UI libraries used—everything is custom-coded for a clean, responsive, and animated experience.

---

## 🚀 Features

### 🔐 Authentication
- Secure user registration and login with **JWT** and **bcrypt-hashed passwords**.

### 📋 Task Management
- Tasks include: `title`, `description`, `assigned user`, `status` (`Todo`, `In Progress`, `Done`), and `priority`.
- Drag and drop between columns.
- Assign/reassign users to any task.

### 🌐 Real-Time Collaboration
- Uses **Socket.IO** for live updates.
- All users see changes (add, update, delete, assign) instantly.

### 📜 Action Log
- Every action (add/edit/delete/assign/move) is logged with timestamp and user.
- API to fetch the last 20 actions.
- Live-updated activity log panel in the UI.

### ⚠️ Conflict Detection
- Detects simultaneous edits.
- Shows both versions of a conflicted task.
- Users can choose to **merge** or **overwrite** changes.

### 🧠 Smart Assign
- One-click "Smart Assign" button assigns the task to the user with the **fewest active tasks** (not done yet).

### ✅ Validation Rules
- Task titles must be **unique per board**.
- Task titles **cannot match** column names (`Todo`, `In Progress`, `Done`).

---

## 🖥️ Frontend (React)

- Built **from scratch** without any UI libraries (no Bootstrap, Tailwind, etc.).
- Custom forms for login and register.
- Kanban-style board (Todo / In Progress / Done).
- Responsive design for **desktop & mobile**.
- Smooth drag & drop + at least **one custom animation**.

---

## 🔧 Backend (Node.js + Express + MongoDB)

- RESTful API for tasks, users, logs.
- Real-time event broadcasting via **Socket.IO**.
- JWT-based authentication system.
- MongoDB schema for tasks, users, and activity logs.

---

## 📦 Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time:** Socket.IO
- **Authentication:** JWT + bcrypt
- **Deployment:** (Optional: Vercel/Netlify + Render/Heroku)
