# Web App (React + Vite)

## Prerequisites
- Node.js 18+

## Setup
1. Install dependencies
   ```bash
   npm install
   ```

## Run
- Development
  ```bash
  npm run dev
  ```
  App will open at: http://localhost:5173

## What it does
- Login using API: `http://localhost:8000/api/login`
- Home loads geolocation using `https://ipinfo.io//geo`
- Search by IPv4, keep history, re-open entries, multi-select delete, and shows a map pin.

## Notes
- Make sure the API server is running on port 8000 before logging in.
- Default login (from API seed):
  - Email: `CharlesNinong@example.com`
  - Password: `Password123`
