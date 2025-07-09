// frontend/src/redux/slices/budgetsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  budgets: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Helper to get auth header
const getAuthHeader = (getState) => {
    const { auth } = getState();
    return auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {};

// Async Thunk for fetching budgets
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (_, { getState }) => {
  const response = await fetch('http://localhost:3001/api/budgets');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch budgets');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for adding a budget
export const addBudget = createAsyncThunk('budgets/addBudget', async (newBudget, { dispatch, getState }) => {
  const response = await fetch('http://localhost:3001/api/budgets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
    body: JSON.stringify(newBudget),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add budget');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for updating a budget
export const updateBudget = createAsyncThunk('budgets/updateBudget', async (updatedBudget, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/budgets/${updatedBudget._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
    body: JSON.stringify(updatedBudget),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update budget');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for deleting a budget
export const deleteBudget = createAsyncThunk('budgets/deleteBudget', async (budgetId, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/budgets/${budgetId}`, {
    method: 'DELETE',
    headers: {
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete budget');
  }
  return budgetId;
});


const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Budget
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      // Update Budget
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      // Delete Budget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
      });
  },
});

export default budgetsSlice.reducer;

