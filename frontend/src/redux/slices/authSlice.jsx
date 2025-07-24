// frontend/src/redux/slices/authSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

// Load user info and token from session storage on initial load
const userInfoFromStorage = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null;

const userTokenFromStorage = sessionStorage.getItem('userToken')
    ? sessionStorage.getItem('userToken')
    : null;

const initialState = {
    user: userInfoFromStorage,
    token: userTokenFromStorage,
    isAuthenticated: !!userInfoFromStorage, // True if user info exists
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            // action.payload should contain { _id, name, username, token }
            state.user = action.payload;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            sessionStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store full user object
            sessionStorage.setItem('userToken', action.payload.token); // Store token separately for convenience
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

