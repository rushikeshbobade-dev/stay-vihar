# Project Development Steps

This file documents the step-by-step development process of the project, including file creations and main points achieved. It will be updated as new changes are made.

## 1. Project Initialization
- Initialized the project using `npm init`, creating `package.json` with basic metadata (name: majorpj, version: 1.0.0).
- Set up the project structure in the current working directory.

## 2. Dependencies and Package.json Setup
- Created `package.json` with the following dependencies:
  - express: ^5.1.0 (web framework)
  - mongoose: ^8.17.1 (MongoDB ODM)
  - ejs: ^3.1.10 (templating engine)
  - ejs-mate: ^4.0.0 (EJS layout engine)
  - joi: ^18.0.1 (validation library)
  - method-override: ^3.0.0 (HTTP method override)
- Added devDependencies:
  - nodeman: ^1.1.2 (auto-restart tool for development)

## 3. Main Application Setup (app.js)
- Created `app.js` as the main entry point for the Express application.
- Imported required modules: express, mongoose, path, method-override, ejs-mate, custom utils, models, and routes.
- Established connection to MongoDB database 'stayVihar' on localhost.
- Configured middleware:
  - express.urlencoded for parsing URL-encoded data
  - express.static for serving static files from 'public' directory
  - methodOverride for supporting PUT/DELETE in forms
  - ejsMate as the view engine for EJS
- Set up view engine and views directory.
- Defined a basic root route ("/") that sends a message.
- Registered route handlers for listings and reviews.
- Implemented error handling middleware for 404 and general errors.
- Started the server on port 8080.

## 4. Models Creation
- Created `models/listing.js`:
  - Defined Mongoose schema for 'Listing' with fields: title (required), description, image (with default and setter), price, location, country, reviews (array of ObjectIds referencing Review).
  - Added post-hook to delete associated reviews when a listing is deleted.
- Created `models/review.js`:
  - Defined Mongoose schema for 'Review' with fields: rating (1-5), comment, createdAt (default to current date).

## 5. Routes Setup
- Created `routes/listing.js`: Handles routes related to listings (CRUD operations).
- Created `routes/review.js`: Handles routes related to reviews (creation, deletion).

## 6. Views and Templates
- Set up `views/` directory for EJS templates.
- Created `views/layouts/boilerPlate.ejs`: Boilerplate layout for consistent page structure.
- Created listing views in `views/listings/`:
  - `index.ejs`: Displays list of listings.
  - `show.ejs`: Shows details of a single listing.
  - `new.ejs`: Form for creating new listing.
  - `edit.ejs`: Form for editing existing listing.
  - `error.ejs`: Error page template.
- Created includes in `views/includes/`:
  - `navbar.ejs`: Navigation bar component.
  - `footer.ejs`: Footer component.

## 7. Utilities
- Created `utils/ExpressError.js`: Custom error class extending Error for handling application errors.
- Created `utils/wrapAsync.js`: Utility function to wrap async route handlers for error catching.

## 8. Public Assets
- Created `public/css/style.css`: Stylesheet for the application's UI.
- Created `public/js/script.js`: Client-side JavaScript for interactive features.

## 9. Initialization Scripts
- Created `init/data.js`: Contains sample data for populating the database.
- Created `init/index.js`: Script to initialize the database with sample listings and reviews.

## 10. Classroom Server
- Created `classroom/server.js`: A separate simple Express server running on port 3000 with a basic home route ("/") that sends a welcome message.

## Notes
- The project appears to be a listing/review application (possibly for accommodations like Wanderlust) using Express, MongoDB, and EJS.
- The classroom/server.js seems to be a separate or practice server.
- This log will be updated with each new file creation or major change made to the project.
