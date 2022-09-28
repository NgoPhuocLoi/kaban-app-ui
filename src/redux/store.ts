import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import boardReducer from './features/boardSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
  },
});

export default store;
