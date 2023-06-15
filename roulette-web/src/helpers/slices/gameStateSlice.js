import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
    name: "gameState",
    initialState: {
        isLocalClientHost: false,
        gamePhase: "idle", // idle, waiting-for-players, voting, results 
        activePlayerIds: [],
        myDiscordId: null,
    },
    reducers: {
        initializeGame: (state, action) => {
            state.isLocalClientHost = true;
            state.gamePhase = "waiting-for-players";
            state.activePlayerIds = [];
        },
        onUserSelect: (state, action) => {
            state.myDiscordId = action.payload;
        }
    },
});

export const { initializeGame, onUserSelect } = gameStateSlice.actions;
export default gameStateSlice.reducer;
