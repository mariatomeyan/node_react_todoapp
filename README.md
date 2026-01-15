Built with Node.js + Express

### Packages

- express - web framework for handling routes and HTTP stuff
- pg - postgres client for database queries
- bcrypt - hashes passwords before storing
- jsonwebtoken - jwt auth tokens
- cors - allows frontend to talk to backend
- dotenv - loads env vars from .env file
- validator - input validation (emails, strings, etc)


## Frontend Setup

Built with React + Vite

### Packages

- react - UI library
- react-router-dom - handles page routing
- axios - makes API calls to backend
- @tanstack/react-query - manages server state and caching
- tailwindcss - utility css for styling

### How it works

Vite bundles everything and serves it during dev. React Query handles all the API stuff like fetching todos, caching, and optimistic updates so the UI feels snappy. Tailwind for styling cuz its fast to work with.

### Install & Run

npm install                                                                                                                                                                                                                                                     
npm run dev

Runs on port 5173

Make sure you have Docker installed.

1. Clone the repo
2. cd into the project folder
3. Run: docker compose up
4. Open http://localhost:5173 in your browser

The app runs on:
- Frontend: localhost:5173
- Backend API: localhost:5001
- Database: localhost:5433

To stop: Ctrl+C                                                                                                                                                                                                                                                 
To rebuild after code changes: docker compose up --build 