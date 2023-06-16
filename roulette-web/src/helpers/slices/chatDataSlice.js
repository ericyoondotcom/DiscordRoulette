import { createSlice, current } from "@reduxjs/toolkit";

export const chatDataSlice = createSlice({
    name: "chatData",
    initialState: {
        rawFilesJson: [],
        // a Message Run is a string of messages sent by the same person merged together.
        // This array has all message runs from all files.
        mergedMessageRuns: [],
        // Every member that has sent a chat message that is included in the dataset.
        members: {},
    },
    reducers: {
        resetChatData: (state, action) => {
            state.rawFilesJson = [];
            state.mergedMessageRuns = [];
            state.members = {};
        },
        addFile: (state, action) => {
            state.rawFilesJson.push(action.payload);
        },
        mergeMessages: (state) => {
            const newMergedMessageRuns = [];
            const newMembers = {};

            for(const file of state.rawFilesJson) {
                let currentAuthorId = null;
                let thisRunContent = "";
                for(const message of file) {
                    // Detect runs of messages from the same author and combine them
                    if(message.author.id === currentAuthorId) {
                        thisRunContent += message.content + '\n';
                    } else {
                        if(thisRunContent.length > 0) {
                            newMergedMessageRuns.push({
                                content: thisRunContent,
                                authorId: currentAuthorId,
                            });
                        }
                        currentAuthorId = message.author.id;
                        thisRunContent = "";
                    }

                    // Add member to members list if they aren't already there
                    if(!(message.author.id in newMembers)) {
                        newMembers[message.author.id] = {
                            displayName: message.author.global_name || message.author.username,
                            avatarUrl: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                        };
                    }
                }

                if(thisRunContent.length > 0) {
                    newMergedMessageRuns.push({
                        content: thisRunContent,
                        authorId: currentAuthorId,
                    });
                }
            }

            state.mergedMessageRuns = newMergedMessageRuns;
            state.members = newMembers;
            state.rawFilesJson = []; // Clear out raw files because we don't need them anymore
        },
        onMembersChanged: (state, action) => {
            state.members = action.payload;
        },
    },
});

export const { resetChatData, addFile, mergeMessages, onMembersChanged } = chatDataSlice.actions;
export default chatDataSlice.reducer;
