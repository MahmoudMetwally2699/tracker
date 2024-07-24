import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://tracker-api-gamma.vercel.app/api'; // Update with your API URL

export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveCurrentTrack = createAsyncThunk('tracks/saveCurrentTrack', async (track, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${API_URL}/track`, track, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const trackerSlice = createSlice({
  name: 'tracks',
  initialState: {
    tracks: [],
    currentTrack: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    addPointToTrack: (state, action) => {
      state.currentTrack.push(action.payload);
    },
    resetCurrentTrack: (state) => {
      state.currentTrack = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.tracks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(saveCurrentTrack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveCurrentTrack.fulfilled, (state) => {
        state.isLoading = false;
        state.currentTrack = [];
      })
      .addCase(saveCurrentTrack.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { addPointToTrack, resetCurrentTrack } = trackerSlice.actions;
export default trackerSlice.reducer;
