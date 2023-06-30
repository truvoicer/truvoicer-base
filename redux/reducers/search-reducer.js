// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_IDLE} from "../constants/search-constants";
import {getReducers, getState} from "../../library/helpers/redux";

const defaultState = {
    searchStatus: SEARCH_REQUEST_IDLE,
    searchOperation: NEW_SEARCH_REQUEST,
    extraData: {},
    searchList: [],
    savedItemsList: [],
    itemRatingsList: [],
    pageControls: {
        paginationRequest: false,
        hasMore: false,
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0
    },
    requestService: "",
    provider: "",
    category: "",
    error: {}
};
const defaultReducers = {
    setSearchStatus: (state, action) => {
        state.searchStatus = action.payload;
    },
    setSearchOperation: (state, action) => {
        state.searchOperation = action.payload;
    },
    setExtraData: (state, action) => {
        state.extraData = action.payload;
    },
    setSearchList: (state, action) => {
        state.searchList = action.payload;
    },
    setSavedItemsList: (state, action) => {
        state.savedItemsList = action.payload;
    },
    setItemRatingsList: (state, action) => {
        state.itemRatingsList = action.payload;
    },
    setPageControls: (state, action) => {
        state.pageControls = action.payload;
    },
    setRequestService: (state, action) => {
        state.requestService = action.payload;
    },
    setProvider: (state, action) => {
        state.provider = action.payload;
    },
    setCategory: (state, action) => {
        state.category = action.payload;
    },
    setSearchError: (state, action) => {
        state.error = action.payload;
    },
};

export const searchSlice = createSlice({
    name: "search",
    initialState: getState("search", defaultState),
    reducers: getReducers("search", defaultReducers),
});

export const searchReducer = searchSlice.reducer;

export const {
    setSearchStatus,
    setSearchOperation,
    setExtraData,
    setSearchList,
    setSavedItemsList,
    setItemRatingsList,
    setPageControls,
    setRequestService,
    setProvider,
    setCategory,
    setSearchError
} = searchSlice.actions;
