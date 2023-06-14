import { createSlice } from "@reduxjs/toolkit";

export const chatDataSlice = createSlice({
    name: "chatData",
    initialState: {
        csvBlobs: [],
        messages: [],
    },
    reducers: {
        setCsvBlobs: (state, action) => {
            state.csvBlobs = action.payload.csvBlobs;
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
    },
});

export const { setGameCode } = chatDataSlice.actions;
export default chatDataSlice.reducer;
