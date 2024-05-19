
// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";

const defaultState = {
    [DISPLAY_AS]: null,
    type: null,
    data: {},
    provider: "",
    category: "",
    itemId: "",
    error: {}
};

const defaultReducers = {
    setItemDisplayAs: (state, action) => {
        state[DISPLAY_AS] = action.payload;
    },
    setItemType: (state, action) => {
        state.type = action.payload;
    },
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
export const { setItemDisplayAs, setItemType, setItemId, setItemCategory, setItemData, setItemProvider, setItemError } = itemSlice.actions;
