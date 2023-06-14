import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
    name: "gameState",
    initialState: {
        gameCode: null,
        host: null,
        activePlayers: null,
    },
    reducers: {
        setGameCode: (state, action) => {
            state.gameCode = action.payload.gameCode;
        },
    },
});

export const { setGameCode } = gameStateSlice.actions;
export default gameStateSlice.reducer;
