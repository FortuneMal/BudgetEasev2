// frontend/src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.jsx';
import expensesReducer from './slices/expensesSlice.jsx';
import budgetsReducer from './slices/budgetsSlice.jsx';
import goalsReducer from './slices/goalsSlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    budgets: budgetsReducer,
    goals: goalsReducer,
  },
});

