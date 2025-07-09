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

The terminal should show: ➜ Local: http://localhost:5173/. Keep this terminal open.

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
