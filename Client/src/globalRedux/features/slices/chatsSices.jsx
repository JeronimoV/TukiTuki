import { createSlice } from "@reduxjs/toolkit";

export const chatSlices = createSlice({
    name:"chatSlices",
    initialState:{
        chatId: 0,
        chatStatus: false,
        socket: ""
    },
    reducers:{
        saveChatId: (state, action) => {
            state.chatId = action.payload
        },
        setChatStatus:(state,action) => {
            state.chatStatus = action.payload
        },
        setSocket: (state,action) => {
            state.socket = action.payload
        }
    }
})

const saveChatData = chatSlices.reducer

export const {saveChatId, setSocket, setChatStatus} = chatSlices.actions
export default saveChatData