import { createSlice } from "@reduxjs/toolkit";

export const chatSlices = createSlice({
    name:"chatSlices",
    initialState:{
        chatId: 0,
        lastMessage: {},
        chatStatus: false
    },
    reducers:{
        saveChatId: (state, action) => {
            state.chatId = action.payload
        },
        saveLastMessage:(state, action) => {
            state.lastMessage = state.lastMessage[action.payload.userId] = action.payload.lastMessage 
        },
        setChatStatus:(state,action) => {
            state.chatStatus = action.payload
        }
    }
})

const saveChatData = chatSlices.reducer

export const {saveChatId, saveLastMessage, setChatStatus} = chatSlices.actions
export default saveChatData