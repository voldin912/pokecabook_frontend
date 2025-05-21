import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
  decks_count: 0,
  event_count: 0,
  specific_deck_count: 0,
  loading: false,
  error: null,
  openSearch: false,
  openDeck: false,
  cardcategory_conds: ""
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOpenSearch: (state, action) => {
      state.openSearch = action.payload;
    },
    setCards: (state, action) => {
      state.cards = action.payload.rows;
      state.decks_count = action.payload.filtered_decks_count;
      state.event_count = action.payload.filtered_events_count;
      state.specific_deck_count = action.payload.filtered_specific_decks_count;
    },
    setCardConds: (state, action) =>{
      state.cardcategory_conds = action.payload;
    }
  },
});

export const { setLoading, setError, setOpenSearch, setCards, setCardConds } = pokemonSlice.actions;

// Selectors
export const selectLoading = (state) => state.pokemon.loading;
export const selectError = (state) => state.pokemon.error;
export const selectOpenSearch = (state) => state.pokemon.openSearch; 
export const selectCards = (state) => state.pokemon.cards;
export const selectDeckCount = (state) => state.pokemon.decks_count;
export const selectEventCount = (state) => state.pokemon.event_count;
export const selectSpecificDeckCount = (state) => state.pokemon.specific_deck_count;
export const selectConditions = (state) => state.pokemon.cardcategory_conds;

export default pokemonSlice.reducer;
