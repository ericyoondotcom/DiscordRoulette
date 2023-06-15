import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
    name: "gameState",
    initialState: {
        host: null,
        activePlayers: null,
    },
    reducers: {
        initializeGame: (state, action) => {
            
        },
    },
});

export const { initializeGame } = gameStateSlice.actions;
export default gameStateSlice.reducer;
