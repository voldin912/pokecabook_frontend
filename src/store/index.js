import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './slices/pokemonSlice';
import cardCategoryReducer from './slices/cardCategorySlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    cardCategory: cardCategoryReducer,
    // Add other reducers here
  },
});
