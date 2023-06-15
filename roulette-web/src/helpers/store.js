import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./slices/gameStateSlice";
import chatDataReducer from "./slices/chatDataSlice";

export default configureStore({
    reducer: {
        gameState: gameStateReducer,
        chatData: chatDataReducer,
    },
});
