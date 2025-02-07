import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
  loading: false,
  error: null,
  open: false,
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
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setCards: (state, action) => {
      state.cards = action.payload;
    },
  },
});

export const { setLoading, setError, setOpen, setCards } = pokemonSlice.actions;

// Selectors
export const selectLoading = (state) => state.pokemon.loading;
export const selectError = (state) => state.pokemon.error;
export const selectOpen = (state) => state.pokemon.open; 
export const selectCards = (state) => state.pokemon.cards;

export default pokemonSlice.reducer;
