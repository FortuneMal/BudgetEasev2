// frontend/src/redux/slices/authSlice.jsx (excerpt)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(sessionStorage.getItem('userInfo')) || null, // Changed from currentUser to userInfo
  token: sessionStorage.getItem('userToken') || null,
  isAuthenticated: !!sessionStorage.getItem('userInfo'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload; // action.payload should now be the user object with _id, name, username, and token
      state.token = action.payload.token;
      state.isAuthenticated = true;
      sessionStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store user info including token
      sessionStorage.setItem('userToken', action.payload.token); // Store token separately for easy access
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('userToken');
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
