import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPlaceCard = createAsyncThunk(
  'placeCard/fetchPlaceCard',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`https://playpokecabook.com/api/place-card`, {
        // const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/place-card`, {
        page: page,
        pageSize: pageSize
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch place card');
    }
  }
);

export const fetchTotalPlaceCardLength = createAsyncThunk(
  'placeCard/fetchTotalPlaceCardLength',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://playpokecabook.com/api/place-card/total`);
      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/place-card/total`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch total place card length');
    }
  }
);

const initialState = {
  placeCard: [],
  status: 'idle',
  error: null,
  totalPlaceCardLength: 0
};

const placeCardSlice = createSlice({
  name: 'placeCard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaceCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaceCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.placeCard = action.payload;
      })
      .addCase(fetchPlaceCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchTotalPlaceCardLength.fulfilled, (state, action) => {
        state.totalPlaceCardLength = action.payload;
      });
  }
});

// export const { } = placeCardSlice.actions;

export const selectPlaceCard = (state) => state.placeCard.placeCard;
export const selectStatus = (state) => state.placeCard.status;
export const selectError = (state) => state.placeCard.error;
export const selectTotalPlaceCardLength = (state) => state.placeCard.totalPlaceCardLength;

export default placeCardSlice.reducer;