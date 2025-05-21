import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './slices/pokemonSlice';
import cardCategoryReducer from './slices/cardCategorySlice';
import dayCardReducer from './slices/dayCardSlice';
import placeCardReducer from './slices/placeCardSlice';
import deckCardReducer from './slices/deckCardSlice';
export const store = configureStore({
  reducer: {
    deckCard: deckCardReducer,
    pokemon: pokemonReducer,
    cardCategory: cardCategoryReducer,
    dayCard: dayCardReducer,
    placeCard: placeCardReducer,
    // Add other reducers here
  },
});
