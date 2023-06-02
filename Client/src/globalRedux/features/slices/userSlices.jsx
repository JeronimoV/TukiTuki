import { createSlice } from "@reduxjs/toolkit";

export const UserSlices = createSlice({
    name:"userSlices",
    initialState:{
        id: ""
    },
    reducers:{
        saveUserData: (state, action) => {
            state.id = action.payload
        }
    }
})

export const {saveUserData} = UserSlices.actions