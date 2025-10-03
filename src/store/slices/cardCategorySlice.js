import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCardCategories = createAsyncThunk(
  'cardCategory/fetchCardCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://playpokecabook.com/api/card-category`);
      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/card-category`);
      
      const transformedData = response.data.map(item => ({
        id: item.id,
        conds: item.conds,
        value: item.category1_var,
        label: item.category1_var,
      }));
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
  cardCategories_1: [],
  cardCategories_2: [],
  leagueOptions: [{
    value: 2,
    label: "オープン"
  }, {
    value: 3,
    label: "マスタ"
  }, {
    value: 4,
    label: "ジュニア"
  }, {
    value: 5,
    label: "シニア"
  }],
  loading: false,
  error: null,
};

// Helper function to analyze and split categories
const analyzeAndSplitCategories = (categories) => {
  const cardCategories_1 = [];
  const cardCategories_2 = [];
  
  categories.forEach(item => {
    const categoryName = item.value;
    
    if (categoryName.includes('（')) {
      // Extract the base name (before the first parenthesis)
      const baseName = categoryName.substring(0, categoryName.indexOf('（'));
      
      // Remove parentheses and spaces for the variant name
      const variantName = categoryName.replace(/[（）]/g, '').replace(/\s+/g, '');
      
      // Find or add base name to cardCategories_1
      let baseCategoryIndex = cardCategories_1.findIndex(cat => cat.value === baseName);
      if (baseCategoryIndex === -1) {
        cardCategories_1.push({
          id: item.id,
          conds: item.conds,
          value: baseName,
          label: baseName,
          originalValue: categoryName
        });
        baseCategoryIndex = cardCategories_1.length - 1;
      }
      
      // Add variant name to cardCategories_2 with index mapping
      cardCategories_2.push({
        id: item.id,
        conds: item.conds,
        value: categoryName,
        label: variantName,
        originalValue: categoryName,
        index: baseCategoryIndex      // Index of corresponding item in cardCategories_1
      });
    } else {
      // If no parentheses, only add to cardCategories_1
      cardCategories_1.push({
        id: item.id,
        conds: item.conds,
        value: item.value,
        label: item.label
      });
    }
  });
  
  return { cardCategories_1, cardCategories_2 };
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
        state.cardCategories = action.payload;
        
        // Analyze and split the categories
        const { cardCategories_1, cardCategories_2 } = analyzeAndSplitCategories(action.payload);
        state.cardCategories_1 = cardCategories_1;
        state.cardCategories_2 = cardCategories_2;
      })
      .addCase(fetchCardCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCardCategory } = cardCategorySlice.actions;

export const selectCardCategory = (state) => state.cardCategory.cardCategory;
export const selectCardCategories1 = (state) => state.cardCategory.cardCategories_1;
export const selectCardCategories2 = (state) => state.cardCategory.cardCategories_2;
export const selectLoading = (state) => state.cardCategory.loading;
export const selectError = (state) => state.cardCategory.error;

export default cardCategorySlice.reducer;
