# Campus Events Hub

A web application for managing campus events, allowing students to create, join, and manage various campus activities.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the backend directory with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=campus_events_hub
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
   Replace the values with your actual configuration:
   - `DB_HOST`: Your MySQL host (usually localhost)
   - `DB_USER`: Your MySQL username
   - `DB_PASSWORD`: Your MySQL password
   - `DB_NAME`: Database name (default: campus_events_hub)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `PORT`: Backend server port (default: 5000)

3. **Database Setup**
   - Make sure MySQL is running
   - The database will be automatically created and tables set up on first run
   - Alternatively, you can manually set up the database using:
     ```bash
     cd database
     mysql -u root -p < schema.sql
     ```

4. **Start the Application**
   ```bash
   # Start backend server (from backend directory)
   cd backend
   npm start
   ```

The application will be running at:
- Backend API: http://localhost:5000
- Frontend: Open frontend/index.html in your browser

## Features

- User authentication (register/login)
- Create and manage events
- Browse available events
- Register for events
- View event details and attendees
- User profiles

## Database Structure

The application uses three main tables:
- Users: Store user information and credentials
- Events: Store event details
- EventAttendees: Track event registrations

## Troubleshooting

If you encounter database connection issues:
1. Make sure MySQL is running
2. Verify your MySQL credentials in the .env file
3. Ensure the campus_events_hub database exists

For any other issues, please contact: [Your Contact Information] 