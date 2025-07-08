# webhooks-alternative

This project consists of a React frontend and a Ruby on Rails backend API for webhook testing.

## Project Structure
- `webhooks-backend/` — Ruby on Rails API backend
- `webhooks-frontend/` — React frontend

## Prerequisites
- Ruby (see `webhooks-backend/.ruby-version` for the required version)
- Node.js and npm (for the frontend)
- Bundler (`gem install bundler`)

## Setup & Running the Application

### 1. Backend (Rails API)
```sh
cd webhooks-backend
bundle install
# Setup the database (if needed)
bin/rails db:prepare
# Start the Rails server on port 3001
bin/rails server -p 3001
```
- The backend will be available at `http://localhost:3001`.
- CORS is enabled for requests from the frontend (`http://localhost:3000`).

### 2. Frontend (React)
```sh
cd webhooks-frontend
npm install
npm start
```
- The frontend will be available at `http://localhost:3000`.
- It fetches data from the backend at `http://localhost:3001/endpoint/show`.

## Important Notes
- **Ports:** Backend runs on 3001, frontend on 3000. Make sure both are free.
- **CORS:** Configured for local development. Update for production as needed.
- **Environment Variables:** If deploying, ensure the frontend points to the correct backend URL.
- **Database:** The backend uses a local database. Run migrations if needed.

## Usage
1. Start the backend and frontend as described above.
2. Visit `http://localhost:3000` in your browser.
3. The app will display a value fetched from the backend, refreshing on navigation.
