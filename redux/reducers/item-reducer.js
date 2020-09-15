
// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";

const defaultState = {
    data: {},
    provider: "",
    category: "",
    itemId: "",
    error: {}
};

const defaultReducers = {
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
};

export const itemSlice = createSlice({
    name: "item",
    initialState: getState("item", defaultState),
    reducers: getReducers("item", defaultReducers),
});

export const itemReducer = itemSlice.reducer;
export const { setItemId, setItemCategory, setItemData, setItemProvider, setItemError } = itemSlice.actions;