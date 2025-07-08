// frontend/src/redux/slices/expensesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunk for fetching expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, { getState }) => {
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
  const { auth } = getState(); // Assuming auth slice holds token if implemented
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
```javascript
// frontend/src/redux/slices/budgetsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  budgets: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

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
```javascript
// frontend/src/redux/slices/goalsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  goals: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunk for fetching goals
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async (_, { getState }) => {
  const response = await fetch('http://localhost:3001/api/goals');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch goals');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for adding a goal
export const addGoal = createAsyncThunk('goals/addGoal', async (newGoal, { dispatch, getState }) => {
  const response = await fetch('http://localhost:3001/api/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newGoal),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add goal');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for updating a goal
export const updateGoal = createAsyncThunk('goals/updateGoal', async (updatedGoal, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/goals/${updatedGoal._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedGoal),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update goal');
  }
  const data = await response.json();
  return data;
});

// Async Thunk for deleting a goal
export const deleteGoal = createAsyncThunk('goals/deleteGoal', async (goalId, { dispatch, getState }) => {
  const response = await fetch(`http://localhost:3001/api/goals/${goalId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete goal');
  }
  return goalId;
});


const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Goals
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Goal
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      // Update Goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      // Delete Goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
      });
  },
});

export default goalsSlice.reducer;

