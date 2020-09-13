
// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";

const itemState = {
    data: {},
    provider: "",
    category: "",
    itemId: "",
    error: {}
};

export const itemSlice = createSlice({
    name: "item",
    initialState: itemState,
    reducers: {
        setItemData: (state, action) => {
            state.data = action.payload;
        },
        setItemId: (state, action) => {
            state.itemId = action.payload;
        },
        setItemProvider: (state, action) => {
            state.provider = action.payload;
        },
        setItemCategory: (state, action) => {
            state.category = action.payload;
        },
        setItemError: (state, action) => {
            state.error = action.payload;
            console.error(state.error)
        },
    },
});

export const itemReducer = itemSlice.reducer;
export const { setItemId, setItemCategory, setItemData, setItemProvider, setItemError } = itemSlice.actions;