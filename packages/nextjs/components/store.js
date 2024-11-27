"use client";

import Reducer from "./features/app-slice";
import { configureStore } from "@reduxjs/toolkit";

export const constants = {
  BIRD_SIZE: 34,
  GRAVITY: 5,
  BIRD_OFFSET: 25,
  PIPE_GAP: 120,
  PIPE_WIDTH: 52,
  PIPE_VELOCITY: 2,
  JUMP: 50,
  WINDOW_HEIGHT: 600,
  WINDOW_WIDTH: 288,
  DESKTOP_WIDTH: 800,
  PIPE_SPACING: 250,
  DEFAULT_BIRD_Y: 250,
};

export const store = configureStore({
  reducer: Reducer,
});
