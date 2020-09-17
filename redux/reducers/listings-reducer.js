import store from "../store"
// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {LISTINGS_GRID_COMPACT} from "../constants/listings-constants";
import {getReducers, getState} from "../../library/helpers/redux";
import {isSet} from "../../library/utils";
import {siteConfig} from "../../../config/site-config";

const defaultState = {
    category: "",
    listingsGrid: isSet(siteConfig.defaultGridSize)? siteConfig.defaultGridSize : LISTINGS_GRID_COMPACT,
    listingsData: {},
    listingsQueryData: {},
    listingsSearchResults: {},
    listingsRequestStatus: "",
    error: {}
};
const defaultReducers = {
    setCategory: (state, action) => {
        state.category = action.payload;
    },
    setListingsGrid: (state, action) => {
        state.listingsGrid = action.payload;
    },
    setListingsData: (state, action) => {
        state.listingsData = action.payload;
    },
    setListingsQueryData: (state, action) => {
        // console.log(action.payload)
        state.listingsQueryData = action.payload;
        // console.log(state.listingsQueryData)
    },
    setListingsSearchResults: (state, action) => {
        state.listingsSearchResults = action.payload;
    },
    setListingsDataProviders: (state, action) => {
        state.listingsData.providers = action.payload;
    },
    setListingsError: (state, action) => {
        state.error = action.payload;
    },
};

export const listingsSlice = createSlice({
    name: "listings",
    initialState: getState("listings", defaultState),
    reducers: getReducers("listings", defaultReducers),
});


export const listingsReducer = listingsSlice.reducer;

export const {
    setCategory,
    setListingsGrid,
    setListingsData,
    setListingsDataProviders,
    setListingsQueryData,
    setListingsSearchResults,
    setListingsError
} = listingsSlice.actions;