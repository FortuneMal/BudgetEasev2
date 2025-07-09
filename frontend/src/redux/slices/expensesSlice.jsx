// frontend/src/redux/slices/expensesSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // <-- ENSURE THIS LINE IS CORRECT

const initialState = {
  expenses: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Helper to get auth header
const getAuthHeader = (getState) => {
    const { auth } = getState();
    return auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
};

// Async Thunk for fetching expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, { getState }) => {
  const response = await fetch('http://localhost:3001/api/expenses', {
    headers: getAuthHeader(getState), // Include auth header
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch expenses');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for adding an expense
export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense, { dispatch, getState }) => {
  const response = await fetch('http://localhost:3001/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(getState), // Include auth header
    },
    body: JSON.stringify(newExpense),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add expense');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for updating an expense
export const updateExpense = createAsyncThunk('expenses/updateExpense', async (updatedExpense, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/expenses/${updatedExpense._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(getState), // Include auth header
    },
    body: JSON.stringify(updatedExpense),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update expense');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for deleting an expense
export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (expenseId, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: getAuthHeader(getState), // Include auth header
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete expense');
  }
  return expenseId;
});


const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // You might keep some synchronous reducers for immediate UI updates
    // or clear state on logout, etc.
  },
  extraReducers(builder) {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload; // Set expenses from API response
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Expense
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload); // Add new expense to state
      })
      // Update Expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload; // Update existing expense in state
        }
      })
      // Delete Expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp._id !== action.payload); // Remove deleted expense
      });
  },
});

export default expensesSlice.reducer;

