# Product Requirements Document (PRD)

## Project Overview
This project is a simple web application that demonstrates a React frontend communicating with a Ruby on Rails backend API. The frontend displays a value fetched from a backend endpoint, and the value refreshes each time the user navigates to the page.

---

## Features

### Backend (Ruby on Rails)
- **API-only Rails app** (`webhooks-backend`)
- Provides a single endpoint: `GET /endpoint/show`
  - Returns a JSON object with a random value (e.g., `{ value: 123 }`).
- CORS enabled for requests from the React frontend (`http://localhost:3000`).
- Backend server runs on port **3001** (to avoid conflict with React's default port).

### Frontend (React)
- **React app** (`webhooks-frontend`)
- Fetches the value from the backend endpoint (`http://localhost:3001/endpoint/show`).
- Displays the value on the page.
- The value refreshes each time the user navigates to the page (component mounts).
- Uses `axios` for HTTP requests.

---

## Setup Steps

### 1. Project Structure
- Created two directories:
  - `webhooks-backend` (Rails API backend)
  - `webhooks-frontend` (React frontend)

### 2. Rails Backend Setup
- Created a new Rails API-only app: `rails new webhooks-backend --api`
- Added the `rack-cors` gem (already present by default in Rails API template).
- Configured CORS in `config/initializers/cors.rb` to allow requests from `http://localhost:3000`.
- Generated an `EndpointController` with a `show` action:
  - Returns a random value as JSON.
- Updated `config/routes.rb` to add the endpoint route.
- Changed `config/puma.rb` to run the server on port 3001.
- Started the Rails server: `rails server -p 3001`

### 3. React Frontend Setup
- Created a new React app: `npx create-react-app webhooks-frontend`
- Installed `axios` for HTTP requests: `npm install axios`
- Updated `src/App.js`:
  - Fetches the value from the backend endpoint on mount.
  - Displays loading, error, or the value.
- Started the React development server: `npm start`

---

## Usage
- Start the Rails backend (`cd webhooks-backend && rails server -p 3001`).
- Start the React frontend (`cd webhooks-frontend && npm start`).
- Visit `http://localhost:3000` in your browser.
- The page will display a value fetched from the backend, which refreshes each time you navigate to the page.

---

## Notes
- The backend and frontend run on different ports for development.
- CORS is configured for local development only. Update the CORS settings for production as needed.
- The backend endpoint returns a random value for demonstration purposes.
