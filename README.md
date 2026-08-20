# BudgetEase | Personal Finance Intelligence

[![Live App](https://img.shields.io/badge/Live-App-success)](https://budget-easev2.vercel.app/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)](https://supabase.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB)](https://reactjs.org/)

BudgetEase is a full-stack personal finance management platform designed to give users granular control over their financial health, combining budgeting, expense tracking, and savings goals with AI-assisted expense entry.

**Live Application:** [budget-easev2.vercel.app](https://budget-easev2.vercel.app/)
**Source Code:** [github.com/FortuneMal/BudgetEasev2](https://github.com/FortuneMal/BudgetEasev2)

---

## Core Capabilities

- **Secure Identity Management:** User onboarding and session persistence powered by Supabase Auth.
- **AI-Assisted Expense Entry:** A FastAPI microservice uses Groq (Llama 3) to parse natural-language expense descriptions into structured amount, merchant, and category data, and OpenAI's GPT-4o vision to extract the same details directly from a photographed receipt.
- **Precision Expense Tracking:** Real-time logging with intelligent categorization for daily expenditures.
- **Targeted Budgeting:** Category-specific threshold monitoring to help prevent overspending and manage cash flow.
- **Savings Orchestration:** Visual goal-setting modules to track progress toward savings targets.
- **Global Currency Utility:** Multi-currency conversion using a live exchange rate API.
- **Interactive Analytics:** Spending visualizations built with Recharts, covering spending trends and category distribution.

---

## Tech Stack and Architecture

### Frontend

- **React (Vite):** Core library for the component-based UI.
- **Redux Toolkit:** State management across modules.
- **Tailwind CSS:** Utility-first styling for a responsive interface.
- **Recharts:** Charting library for the analytics views.

### Backend and Data

- **Supabase:** Primary backend infrastructure — PostgreSQL database, authentication, and auto-generated REST APIs. This is what the deployed app actually runs on.
- **AI Service (FastAPI/Python):** A separate microservice (`ai_service/`) handling expense categorization (Groq/Llama 3) and receipt parsing (OpenAI GPT-4o vision).

> **Note:** An earlier version of this project used a Node.js/Express backend with MongoDB (still present under `backend/` for reference). The live application has since migrated to Supabase for the database and auth layer, and that Node/Mongo backend is no longer part of the active app.

### Deployment

- **Vercel:** Hosting for the React frontend with automated deployments.
- **Supabase Cloud:** Managed database and authentication.

---

## Installation and Environment Configuration

### Prerequisites

- Node.js (v18.0 or higher)
- Supabase account
- Python 3.10+ (for the AI service, optional)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/FortuneMal/BudgetEasev2.git
cd BudgetEasev2
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Create a `.env` file in `frontend/`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Launch the development environment:

```bash
npm run dev
```

5. (Optional) Run the AI service:

```bash
cd ai_service
pip install -r requirements.txt
```

Create a `.env` file in `ai_service/` with your API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Then start the service:

```bash
python main.py
```

The AI service runs on `http://localhost:8000` and exposes `/categorize` and `/parse-receipt`. Without API keys set, both endpoints return mock data so the UI remains usable during development.

---

## Roadmap

- **Automated Reconciliation:** Integration with Plaid for direct bank feed synchronization.
- **Comprehensive Reporting:** PDF generation for monthly financial statements and tax summaries.
- **Income Stream Management:** Expanded modules for tracking diversified revenue sources.

---

Developed by [Fortune Malaza](https://github.com/FortuneMal)
