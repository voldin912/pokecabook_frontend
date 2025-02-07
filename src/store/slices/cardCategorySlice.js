import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCardCategories = createAsyncThunk(
  'cardCategory/fetchCardCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/card-category`);
      console.log("response_here==>", response.data);
      const transformedData = response.data.map(item => ({
        value: item.category1_var,
        label: item.category1_var
      }));

      // console.log("Here is me!");
      // console.log("transformedData==>", transformedData);
      
      // if (!response.ok) {
      //   return rejectWithValue(`HTTP error! status: ${response.status}`);
      // }
      
      return transformedData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch card categories'
      );
    }
  }
);

const initialState = {
  cardCategories: [],
  loading: false,
  error: null,
};

export const cardCategorySlice = createSlice({
  name: 'cardCategory',
  initialState,
  reducers: {
    setCardCategory: (state, action) => {
      state.cardCategories = action.payload;
      console.log("state.cardCategory==>", state.cardCategories);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardCategories.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action.payload==>", action.payload);
        state.cardCategories = action.payload;
      })
      .addCase(fetchCardCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCardCategory } = cardCategorySlice.actions;

export const selectCardCategory = (state) => state.cardCategory.cardCategory;
export const selectLoading = (state) => state.cardCategory.loading;
export const selectError = (state) => state.cardCategory.error;

export default cardCategorySlice.reducer;
