// frontend/src/redux/slices/goalsSlice.jsx
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
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
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
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
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
    headers: {
      // 'Authorization': `Bearer ${auth.token}` // Future: Send JWT token
    },
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

