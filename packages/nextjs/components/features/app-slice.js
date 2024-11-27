import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  birdPosition: 250,
  gameStarted: false,
  isGameOver: false,
  score: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setBirdPosition: (state, action) => {
      state.birdPosition = Math.max(0, state.birdPosition + action.payload);
    },
    startGame: state => {
      state.gameStarted = true;
      state.birdPosition = 250;
      state.isGameOver = false;
    },
    gameOver: state => {
      state.isGameOver = true;
      state.gameStarted = false;
    },
    resetGame: () => initialState,
  },
});

export const { setBirdPosition, startGame, gameOver, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
