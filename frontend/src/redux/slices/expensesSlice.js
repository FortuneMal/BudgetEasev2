import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  status: 'idle',
  error: null,
};

// Async Thunk for fetching expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, { getState }) => {
  const { auth } = getState();
  // In a real app, you'd send a JWT token in headers for authentication
  // For this demo, we're relying on the backend's mock protect middleware for now
  const response = await fetch('http://localhost:3001/api/expenses');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch expenses');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for adding an expense
export const addExpense = createAsyncThunk('expenses/addExpense', async (newExpense, { dispatch, getState }) => {
  const { auth } = getState();
  const response = await fetch('http://localhost:3001/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
    body: JSON.stringify(newExpense),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add expense');
  }
  const data = await response.json();
  return data; // This will be the new expense object from the server
});

// Async Thunk for updating an expense
export const updateExpense = createAsyncThunk('expenses/updateExpense', async (updatedExpense, { dispatch, getState }) => {
  const { auth } = getState();
  const response = await fetch(`http://localhost:3001/api/expenses/${updatedExpense._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
    body: JSON.stringify(updatedExpense),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update expense');
  }
  const data = await response.json();
  return data; // This will be the updated expense object from the server
});

// Async Thunk for deleting an expense
export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (expenseId, { dispatch, getState }) => {
  const { auth } = getState();
  const response = await fetch(`http://localhost:3001/api/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: {
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete expense');
  }
  // No data returned for delete, just confirm success
  return expenseId; // Return the ID of the deleted expense
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
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload); // Add new expense to state
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload; // Update existing expense in state
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp._id !== action.payload); // Remove deleted expense
      });
  },
});

export default expensesSlice.reducer;
