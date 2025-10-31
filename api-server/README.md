# API Server (Node + Express + SQLite)

## Prerequisites
- Node.js 18+

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Seed database (creates a default user)
   ```bash
   npm run seed
   ```
   Credentials:
   - Email: email@example.com
   - Password: Password123

## Run
- Development (with nodemon):
  ```bash
  npm run dev
  ```
- Or plain node:
  ```bash
  npm start
  ```

API will run at: http://localhost:8000

## Endpoints
- POST `/api/login`
  - Body: `{ "email": string, "password": string }`
  - Response: `{ token: string, user: { id, name, email } }`

## Env
Create `.env` (already provided):
```
PORT=8000
JWT_SECRET=supersecretkey
DB_FILE=./data/database.sqlite
```
