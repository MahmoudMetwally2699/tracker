import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, signupUser } from '../ap/authApi';

const initialState = {
  userToken: null,
  isLoading: true,
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUser(email, password);
    await AsyncStorage.setItem('userToken', data.token);
    return data.token;
  } catch (error) {
    return rejectWithValue( 'Login failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const data = await signupUser(name, email, password);
    await AsyncStorage.setItem('userToken', data.token);
    return data.token;
  } catch (error) {
    return rejectWithValue('Signup failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await AsyncStorage.removeItem('userToken');
  dispatch(setUserToken(null));
});

export const checkLogin = createAsyncThunk('auth/checkLogin', async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userToken = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ; // Set a user-friendly error message
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.userToken = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed. Please try again.';
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.userToken = action.payload;
        state.isLoading = false;
      })
      .addCase(checkLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUserToken } = authSlice.actions;
export default authSlice.reducer;
