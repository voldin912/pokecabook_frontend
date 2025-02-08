import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './slices/pokemonSlice';
import cardCategoryReducer from './slices/cardCategorySlice';
import dayCardReducer from './slices/dayCardSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    cardCategory: cardCategoryReducer,
    dayCard: dayCardReducer,
    // Add other reducers here
  },
});
