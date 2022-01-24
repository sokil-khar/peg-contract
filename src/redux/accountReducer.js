import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
    name: 'account',
    initialState: {
        value: 0,
        info: {
        }
    },
    reducers: {
        account: (state, action) => {
            state.info = action.payload
        },
        // increment: (state) => {
        //     state.value += 1
        // },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload
        // },
    },
})

// Action creators are generated for each case reducer function
export const { account } = accountSlice.actions

export default accountSlice.reducer
