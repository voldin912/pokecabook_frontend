import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDayCard = createAsyncThunk(
  'dayCard/fetchDayCard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://playpokecabook.com/api/day-card`);
      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/day-card`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch day card');
    }
  }
);

const initialState = {
  dayCard: [],
  loading: false,
  error: null,
};

export const dayCardSlice = createSlice({
  name: 'dayCard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDayCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDayCard.fulfilled, (state, action) => {
        state.loading = false;
        state.dayCard = action.payload;
      })
      .addCase(fetchDayCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectDayCard = (state) => state.dayCard.dayCard;
export const selectLoading = (state) => state.dayCard.loading;
export const selectError = (state) => state.dayCard.error;

export default dayCardSlice.reducer;