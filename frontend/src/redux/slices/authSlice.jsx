import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// This thunk will handle user registration.
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // TODO: Connect this to your backend API call.
      // const response = await api.post('/api/register', userData);
      // return response.data;

      // Simulating a successful response for now.
      console.log('Simulating user registration with data:', userData);
      return { user: { name: userData.name, username: userData.username } };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed.');
    }
  }
);

// This thunk will handle user login.
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // TODO: Connect this to your backend API call.
      // const response = await api.post('/api/login', credentials);
      // return response.data;

      // Simulating a successful response for now.
      console.log('Simulating user login with data:', credentials);
      return { user: { username: credentials.username } };
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed.');
    }
  }
);

// This thunk will handle user logout.
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect this to your backend API call.
      // const response = await api.post('/api/logout');
      // return response.data;

      // Simulating a successful logout.
      console.log('Simulating user logout.');
      return {};
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Logout failed.');
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // We can add non-async reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // registerUser cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed.';
      })
      // loginUser cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed.';
      })
      // logoutUser cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed.';
      });
  },
});

export default authSlice.reducer;

