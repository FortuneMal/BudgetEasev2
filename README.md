BudgetEase
BudgetEase is a full-stack personal finance management application designed to help users track expenses, set budgets, and manage savings goals. It provides a clear overview of financial activity, enabling users to make informed decisions about their spending and savings habits.

✨ Features
User Authentication: Secure user registration and login using JSON Web Tokens (JWT).

Expense Tracking: Record and categorize daily expenses.

Budget Management: Set and monitor budgets for various categories over specific periods.

Savings Goals: Define and track progress towards personal savings goals.

Currency Converter: Convert amounts between different currencies using a third-party API.

Data Visualization: Basic charts to visualize spending patterns (e.g., expenses by category).

Responsive Design: User-friendly interface adaptable to different screen sizes.

🚀 Technologies Used
Frontend
React.js: A JavaScript library for building user interfaces.

Redux Toolkit: For efficient state management.

React Router DOM: For declarative routing in the application.

Tailwind CSS: A utility-first CSS framework for styling.

Recharts: A composable charting library built with React and D3.

Vite: A fast build tool for modern web projects.

Backend
Node.js: A JavaScript runtime for server-side logic.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

MongoDB: A NoSQL document database.

Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.

Bcrypt.js: For hashing passwords securely.

JSON Web Token (JWT): For secure user authentication.

Dotenv: For managing environment variables.

Node-Fetch: For making HTTP requests from the backend (e.g., to currency API).

CORS: Middleware to enable Cross-Origin Resource Sharing.

Database
MongoDB (Local or Atlas): Used for data persistence.

⚙️ Setup and Installation (Local Development)
Follow these steps to get BudgetEase up and running on your local machine.

Prerequisites
Node.js and npm: Download and Install Node.js (npm is included).

MongoDB: Download and Install MongoDB Community Server or set up a free MongoDB Atlas cluster.

Git: Download and Install Git.

Git Bash (Windows): Recommended for consistent terminal experience.

1. Clone the Repository
Open your Git Bash terminal and clone the project:

git clone https://github.com/your-username/BudgetEasev2.git # Replace with your actual repo URL
cd BudgetEasev2

2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

cd backend
npm install

Create a .env file in the backend directory:

PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/budgetease # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key_here # Generate a strong, random string
CURRENCY_API_KEY=your_exchange_rate_api_key # Get from exchangerate-api.com

MONGO_URI: If using local MongoDB, ensure mongodb://127.0.0.1:27017/budgetease is correct. If using MongoDB Atlas, paste your connection string here.

JWT_SECRET: Crucial for security. Generate a long, random string.

CURRENCY_API_KEY: Sign up for a free API key at ExchangeRate-API and paste it here.

Run the Backend Server:

node server.js

The terminal should show: Backend server listening at http://localhost:3001 and MongoDB Connected: localhost (or your Atlas host). Keep this terminal open.

3. MongoDB Setup
If you are using a local MongoDB instance:

Open a new Git Bash terminal.

Navigate to your MongoDB bin directory (e.g., cd "/c/Program Files/MongoDB/Server/7.0/bin").

Start the MongoDB daemon:

./mongod.exe --dbpath /data/db # Or your custom dbpath

Ensure you have created the /data/db directory or specify an existing one.

The terminal should show "Waiting for connections". Keep this terminal open.

4. Frontend Setup
Navigate to the frontend directory, install dependencies, and configure environment variables.

cd ../frontend # Go back to the root, then into frontend
npm install

Create a .env file in the frontend directory:

VITE_BACKEND_URL=http://localhost:3001

This tells your frontend where to find your backend API.

Run the Frontend Development Server:

npm run dev

The terminal should show: ➜ Local: http://localhost:5173/. Keep this terminal open.

5. Register a User
Before logging in, you need to register a user in your MongoDB database via the backend API.

Open a new Git Bash terminal.

Run the curl command (ensure your backend server is running):

curl -X POST -H "Content-Type: application/json" -d '{"name": "Test User", "username": "testuser", "password": "password123"}' http://localhost:3001/api/users/register

You should see a JSON response with the new user's details and a JWT token.

🚀 Usage
Access the Application: Open your web browser and go to http://localhost:5173/.

Login: Use the credentials of the user you registered (e.g., username: testuser, password: password123).

Explore:

Dashboard: Get an overview of your finances, currency converter, and notifications.

Expenses: Add, view, edit, and delete your daily expenses.

Budgets: Set up and manage budgets for different categories and time periods.

Goals: Create and track your progress towards savings goals.

☁️ Deployment (High-Level Overview)
For production, you would typically deploy your application to cloud platforms:

Database: MongoDB Atlas (as covered in Phase 5).

Backend: Render.com (for Node.js Express applications).

Frontend: Netlify (for static React applications).

Remember to update environment variables (MONGO_URI, VITE_BACKEND_URL, CORS origin) on your chosen deployment platforms.

💡 Future Enhancements
User Profiles: More detailed user profiles and settings.

Income Tracking: Ability to add and track income sources.

Advanced Reporting: More detailed financial reports and analytics.

Recurring Transactions: Feature to manage recurring expenses and income.

Notifications: Real-time notifications for budget alerts or goal milestones.

Multi-currency Support: Allow users to define their primary currency and view reports in it.

Bank Integration: Connect to bank accounts for automatic transaction import (requires third-party APIs like Plaid).

User Interface Improvements: Further polish and refine the UI/UX.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
