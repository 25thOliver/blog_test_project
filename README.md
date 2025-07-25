# Blog Platform

A simple, modern blog platform built with Ruby on Rails, enhanced with Hotwire (Turbo & Stimulus) for dynamic interactivity, and styled with Tailwind CSS.

## Author

Oliver

---

## Tech Stack & Flow

-   **Backend & Frontend:** Ruby on Rails (Full-stack mode)
    -   **Models:** User, Post, Comment (Active Record for ORM)
    -   **Database:** PostgreSQL
    -   **Dynamic Frontend:** Hotwire (Turbo Frames, Turbo Streams, Stimulus) for seamless, no-page-reload interactivity.
    -   **Styling:** Tailwind CSS for a utility-first, responsive UI.
    -   **Pagination:** Kaminari (backend for data, custom views for display).
    -   **Flash Messages:** Integrated into layout for user feedback.

-   **Functionality:**
    -   **Posts:** Users can create, view (list and detail), update, and delete blog posts dynamically.
    -   **Comments:** Each post displays its comments, and users can add new comments and delete existing ones dynamically.
    -   **Users:** Users can be created (by name/email only) to author posts and comments. No password authentication.

---

## Project Structure

-   `/` (root)
    -   `ruby/`
        -   `blog-backend/` — The main Ruby on Rails application (now handling both backend logic and frontend rendering).

---

## Setup Instructions

Make sure you have Ruby (3.1.x or higher recommended), Rails (8.0.x recommended), and PostgreSQL installed.

1.  **Navigate to the application directory:**
    ```sh
    cd ruby/blog-backend
    ```

2.  **Install Ruby dependencies:**
    ```sh
    bundle install
    ```

3.  **Set up the database:**
    ```sh
    rails db:setup
    ```
    This will create the database, load the schema, and seed the data (if `db/seeds.rb` contains any).

4.  **Start the Rails development server and Tailwind CSS watcher:**
    ```sh
    bin/dev
    ```
    This command, set up by `tailwindcss-rails`, will concurrently run the Rails server and the Tailwind CSS compilation process.

5.  **Access the application:**
    Open your browser and visit `http://localhost:3000`.

---

## Notes & Assumptions

-   **No Authentication:** Users are identified and selected by name/email only, as per the initial requirements. There is no password-based login or registration.
-   **Full Rails Application:** The project is now a single Ruby on Rails application handling both backend logic and frontend rendering using server-side HTML and Hotwire for interactivity. The separate React frontend has been removed.
-   **Hotwire (Turbo & Stimulus) Utilized:**
    -   Post and Comment forms submit via Turbo Drive/Frames, preventing full page reloads.
    -   New Posts/Comments are dynamically prepended/appended using Turbo Streams.
    -   Post/Comment deletions are dynamically removed using Turbo Streams.
    -   Flash messages appear dynamically via Turbo Streams.
-   **Tailwind CSS:** Integrated for all styling, providing a modern and responsive design.

---

## Things Left Out / What Could Be Improved

-   **Authentication:** Implement user login/registration with secure authentication (e.g., Devise, OmniAuth) for more realistic user flows.
-   **Testing:** Add comprehensive automated tests (e.g., RSpec for models/controllers, Capybara for system tests to cover Hotwire interactions).
-   **Production Readiness:** Add environment variable management (e.g., Dotenv), Docker Compose for easier setup, and deployment scripts.
-   **UI Polish:** Enhance UI with more advanced features, accessibility improvements, and custom branding beyond basic Tailwind.
-   **Real-time Updates:** For a truly live experience (e.g., new comments appearing without user action), consider Action Cable (WebSockets).
-   **Admin Features:** Develop an admin dashboard for managing users, posts, and comments.
-   **Error Handling:** More robust error pages and client-side form validation feedback using Stimulus or a custom JavaScript approach.
-   **User Experience:** Implement dynamic user creation within the comment/post forms via Turbo Streams/Frames, rather than requiring navigation to a separate page.

---

## License

MIT