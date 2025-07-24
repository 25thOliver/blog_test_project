# Blog Platform Monorepo

A modern blog platform built with a Ruby on Rails backend and a React + TypeScript + Tailwind CSS frontend.

## Author

Oliver

---

## Tech Stack & Flow

- **Backend:** Ruby on Rails (API-only mode)
  - Models: User, Post, Comment
  - RESTful API endpoints for CRUD operations
  - Pagination with Kaminari
  - CORS enabled for frontend-backend communication
  - PostgreSQL database
- **Frontend:** React (Vite) + TypeScript
  - UI: Tailwind CSS
  - State management: React hooks
  - API calls: Axios
  - Features: Pagination, flash messages, form validation, collapsible add-user form
- **Project Structure:**
  - `blog-backend/` — Rails API
  - `blog-frontend/` — React frontend

---

## Setup Instructions

### Backend (blog-backend)
1. Install dependencies:
   ```sh
   bundle install
   ```
2. Set up the database:
   ```sh
   rails db:setup
   ```
3. Start the Rails server:
   ```sh
   rails server
   ```

### Frontend (blog-frontend)
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

---

## Notes & Assumptions
- No authentication: users are selected or created by name/email only (per requirements).
- The backend is API-only; all UI is handled by the React frontend.
- CORS is enabled for local development.
- The frontend and backend are in the same repo for easy setup and review.
- The add-user form is collapsible for better UX.
- All template branding has been removed; the UI and code are original.

---

## Things Left Out / What Could Be Improved
- **Authentication:** Add user login/registration for more realistic user flows.
- **Testing:** Add automated tests (RSpec for backend, Jest/React Testing Library for frontend).
- **Production Readiness:** Add environment variable support, Docker Compose, and deployment scripts.
- **UI Polish:** Add more advanced UI features, accessibility improvements, and custom branding.
- **Real-time Updates:** Use WebSockets or polling for live comment/post updates.
- **Admin Features:** Add admin dashboard for managing users/posts/comments.
- **Error Handling:** More robust error boundaries and user feedback in the frontend.

---

## License
MIT 