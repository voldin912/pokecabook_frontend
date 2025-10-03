import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDeckCard = createAsyncThunk(
  'deckCard/fetchDeckCard',
  async ({ page, pageSize, filterObj }, { rejectWithValue }) => {
    console.log(page, pageSize, filterObj, "filterObj");
    try {
      const response = await axios.post(`https://playpokecabook.com/api/decks`, {
        // const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/decks`, {
        page: page,
        pageSize: pageSize,
        filter: filterObj
      });
      console.log("response data",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch place card');
    }
  }
);

export const fetchTotalDeckCardLength = createAsyncThunk(
  'deckCard/fetchTotalDeckCardLength',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://playpokecabook.com/api/decks/total`);
      // const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/decks/total`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch total place card length');
    }
  }
);

export const fetchDeckStats = createAsyncThunk(
  'deckCard/fetchDeckStats',
  async (filterObj, { rejectWithValue }) => {
    try {
      const response = await axios.post(`https://playpokecabook.com/api/decks/stats`, {
        filter: filterObj
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch deck stats');
    }
  }
);

const initialState = {
  deckCard: [],
  status: 'idle',
  error: null,
  totalDeckCardLength: 0,
  deckStats: {
    eventCount: 0,
    totalDeckCount: 0,
    filteredDeckCount: 0
  }
};

const deckCardSlice = createSlice({
  name: 'deckCard',
  initialState,
  reducers: {
    setOpenDeckSearch: (state, action) => {
      state.openDeck = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeckCard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeckCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deckCard = action.payload;
      })
      .addCase(fetchDeckCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(fetchTotalDeckCardLength.fulfilled, (state, action) => {
        state.totalDeckCardLength = action.payload;
      })
      .addCase(fetchDeckStats.fulfilled, (state, action) => {
        state.deckStats = action.payload;
      });
     
  }
});

export const {setOpenDeckSearch} = deckCardSlice.actions;

export const selectDeckCard = (state) => state.deckCard.deckCard;
export const selectStatus = (state) => state.deckCard.status;
export const selectError = (state) => state.deckCard.error;
export const selectTotalDeckCardLength = (state) => state.deckCard.totalDeckCardLength;
export const selectDeckStats = (state) => state.deckCard.deckStats;

export const selectOpenDeck = (state) => state.deckCard.openDeck; 

export default deckCardSlice.reducer;









// const initialState = {
//   decks: [],
//   decks_count: 0,
//   event_count: 0,
//   specific_deck_count: 0,
//   loading: false,
//   error: null,
//   openSearch: false,
//   openDeck: false,
//   cardcategory_conds: ""
// };

// export const deckCardSlice = createSlice({
//   name: 'deckCard',
//   initialState,
//   reducers: {
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//     setOpenDeckSearch: (state, action) => {
//       state.openDeck = action.payload;
//     },
//     setDecks: (state, action) => {
//       state.decks = action.payload;
//       state.decks_count = action.payload.filtered_decks_count;
//       state.event_count = action.payload.filtered_events_count;
//       state.specific_deck_count = action.payload.filtered_specific_decks_count;
//     },
//     setCardConds: (state, action) =>{
//       state.cardcategory_conds = action.payload;
//     }
//   },
// });

// export const { setLoading, setError, setDecks, setCardConds, setOpenDeckSearch } = deckCardSlice.actions;

// // Selectors
// export const selectLoading = (state) => state.deckCard.loading;
// export const selectError = (state) => state.deckCard.error;
// export const selectOpenDeck = (state) => state.deckCard.openDeck; 
// export const selectDecks = (state) => state.deckCard.decks;
// export const selectDeckCount = (state) => state.deckCard.decks_count;
// export const selectEventCount = (state) => state.deckCard.event_count;
// export const selectSpecificDeckCount = (state) => state.deckCard.specific_deck_count;
// export const selectConditions = (state) => state.deckCard.cardcategory_conds;

// export default deckCardSlice.reducer;
