import { createSlice } from "@reduxjs/toolkit";

export const chatSlices = createSlice({
    name:"chatSlices",
    initialState:{
        chatId: 0,
        socket : null
    },
    reducers:{
        saveChatId: (state, action) => {
            state.chatId = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        }
    }
})

const saveChatData = chatSlices.reducer

export const {saveChatId, setSocket} = chatSlices.actions
export default saveChatData