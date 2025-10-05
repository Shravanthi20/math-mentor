# Math Mentor

A MERN app to practice math problems with random/topic/difficulty generation, authentication, and progress tracking (history, streaks, accuracy). Frontend (React + React Router) with a colorful UI; Backend (Express + MongoDB + JWT).

## Features
- Authentication: Register, Login (JWT stored in localStorage)
- Protected pages: Generate Problem, Profile
- Problem generation modes: random, by topic, by difficulty
- Answer submission with correctness feedback
- Profile: history, scores by topic, streaks, accuracy
- Topics dropdown sourced dynamically from DB
- Chart on Profile: correct vs. incorrect

## Tech Stack
- Frontend: React 18, React Router v6, react-chartjs-2 + chart.js, CRA
- Backend: Node.js, Express, Mongoose, JWT, bcrypt, dotenv
- DB: MongoDB

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string

### 1) Clone & Install
```bash
git clone <this-repo>
cd math-mentor

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2) Configure Environment
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/math-mentor
JWT_SECRET=your_jwt_secret_key
```

### 3) Seed Questions (optional but recommended)
```bash
cd backend
npm run seed
```

### 4) Run
Terminal A (backend):
```bash
cd backend
npm start
```

Terminal B (frontend):
```bash
cd frontend
npm start
```

Frontend runs at `http://localhost:3000` and proxies API to `http://localhost:3001`.

## Usage
1. Register a user, then Login (stores token in localStorage)
2. Use the NavBar:
   - Logged out: Login, Register
   - Logged in: Problem (Generate), Profile, Logout
3. Generate problems:
   - Random
   - By Topic (dropdown loaded from DB via `/api/questions/topics`)
   - By Difficulty (number)
4. Submit answers; correctness and streak are updated. History and scores aggregate in Profile.

## API Overview

Base URL: `http://localhost:3001`

Auth (`/api/users`):
- POST `/register` → { name, email, password }
- POST `/login` → { email, password } → returns `{ token, user }`
- GET `/profile` (Bearer token) → user profile (streaks, counts)

Questions (`/api/questions`) [Bearer token required]:
- GET `/` → query params: `mode=random|topic|difficulty`, `topic?`, `difficulty?`
- PUT `/history` → { questionId, userAnswer } → returns correctness and updated metrics
- GET `/history` → { history, scores }
- GET `/topics` → { topics: string[] }

## Project Structure
```
math-mentor/
  backend/
    src/
      config/db.js
      controller/
        questionController.js
        userController.js
      middleware/auth.js
      models/
        Question.js
        User.js
      routes/
        questionRoutes.js
        userRoutes.js
      seeder.js
      server.js
    package.json
  frontend/
    src/
      pages/
        Login.jsx
        Register.jsx
        GenerateProblem.jsx
        Profile.jsx
      components/NavBar.jsx
      RequireAuth.jsx
      api.js
      App.js
      App.css
      index.js
    package.json
  README.md
```

## Notes
- Ensure backend port is 3001. Frontend `package.json` includes `"proxy": "http://localhost:3001"`.
- JWT is expected in `Authorization: Bearer <token>` header for protected endpoints.
- If you change schema fields, update the seeder accordingly.

## License
MIT
