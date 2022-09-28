import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: [],
  favourites: [],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
    setFavouriteBoards: (state, action) => {
      state.favourites = action.payload;
    },
  },
});

export const { setBoards, setFavouriteBoards } = boardSlice.actions;
export default boardSlice.reducer;
