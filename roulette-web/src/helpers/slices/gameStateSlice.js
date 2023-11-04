import { createSlice } from "@reduxjs/toolkit";

export const gameStateSlice = createSlice({
    name: "gameState",
    initialState: {
        isLocalClientHost: false,
        gamePhase: "idle", // idle, waiting-for-players, voting, results 
        activePlayerIds: [],
        inactivePlayerIds: [],
        myDiscordId: null,
        votes: {},
        points: {},
        currentMessageRun: null,
    },
    reducers: {
        resetGameState: (state, action) => {
            state.isLocalClientHost = false;
            state.gamePhase = "idle";
            state.activePlayerIds = [];
            state.myDiscordId = null;
        },
        initializeGame: (state, action) => {
            state.isLocalClientHost = true;
            state.gamePhase = "waiting-for-players";
            state.activePlayerIds = [];
        },
        onUserSelect: (state, action) => {
            state.myDiscordId = action.payload;
        },
        onGamePhaseChanged: (state, action) => {
            state.gamePhase = action.payload;
        },
        onActivePlayerIdsChanged: (state, action) => {
            state.activePlayerIds = action.payload;
        },
        onInactivePlayerIdsChanged: (state, action) => {
            state.inactivePlayerIds = action.payload;
        },
        onVotesChanged: (state, action) => {
            state.votes = action.payload;
        },
        onPointsChanged: (state, action) => {
            state.points = action.payload;
        },
        onCurrentMessageRunChanged: (state, action) => {
            state.currentMessageRun = action.payload;
        },
    },
});

export const {
    resetGameState,
    initializeGame,
    onUserSelect,
    onGamePhaseChanged,
    onActivePlayerIdsChanged,
    onInactivePlayerIdsChanged,
    onVotesChanged,
    onPointsChanged,
    onCurrentMessageRunChanged,
} = gameStateSlice.actions;
export default gameStateSlice.reducer;
