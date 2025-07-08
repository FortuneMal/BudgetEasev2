import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(sessionStorage.getItem('currentUser')) || null, // Load from session storage
  isAuthenticated: !!JSON.parse(sessionStorage.getItem('currentUser')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set user upon successful login
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('currentUser', JSON.stringify(action.payload)); // Persist
    },
    // Action to clear user upon logout
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('currentUser'); // Clear persisted data
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
