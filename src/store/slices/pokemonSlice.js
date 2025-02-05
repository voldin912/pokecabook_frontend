import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pokemonList: [],
  loading: false,
  error: null,
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setPokemonList: (state, action) => {
      state.pokemonList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPokemonList, setLoading, setError } = pokemonSlice.actions;

// Selectors
export const selectPokemonList = (state) => state.pokemon.pokemonList;
export const selectLoading = (state) => state.pokemon.loading;
export const selectError = (state) => state.pokemon.error;

export default pokemonSlice.reducer;
