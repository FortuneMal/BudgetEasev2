import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // We'll create this next
import expensesReducer from './slices/expensesSlice'; // And this
import budgetsReducer from './slices/budgetsSlice'; // And this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    budgets: budgetsReducer,
    // Add other reducers here as you create them (e.g., goals)
  },
});
