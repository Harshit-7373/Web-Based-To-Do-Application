This project is a real-time, web-based collaborative task management application inspired by platforms like Trello. It allows multiple users to register, log in, and collaboratively manage tasks across a live Kanban board with instant updates, smart task logic, and custom UI/UX. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js) with Socket.IO for real-time communication.

🔧 Key Features
🧠 Backend – Node.js, Express, MongoDB
User Authentication:

Secure user registration and login using hashed passwords and JWT tokens.

Task Management API:

Tasks include fields like title, description, assigned user, status (Todo/In Progress/Done), and priority.

Real-Time Collaboration:

Uses Socket.IO to broadcast task changes (create, update, delete, move) across all users instantly.

Action Logging:

Every change is logged with the user's name, timestamp, and action type.

Exposes a REST API to retrieve the latest 20 actions.

Conflict Resolution:

Detects simultaneous edits and prompts users to choose between merging or overwriting versions.

🎨 Frontend – React (No UI libraries)
Authentication Pages:

Fully custom login and register forms with form validation.

Kanban Task Board:

Tasks are displayed in three draggable columns: Todo, In Progress, Done.

Users can assign tasks to themselves or others.

Activity Log Panel:

Displays the 20 most recent actions in real time.

Custom Styling & Animations:

No use of Bootstrap or third-party UI kits.

Includes smooth drag-drop interactions and at least one custom animation.

Responsive Design:

Optimized for both desktop and mobile devices.

