// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";
import {PAGE_STATUS, PAGE_STATUS_IDLE} from "@/truvoicer-base/redux/constants/page-constants";

const defaultState = {
    [PAGE_STATUS]: PAGE_STATUS_IDLE,
    searchParams: {
        page: null,
        sort_by: null,
        sort_order: null,
        page_size: null,
        query: null,
    },
    pageData: {},
    pageDataOptions: {},
    postData: {},
    postListData: [],
    postNavData: {
        fromList: false,
        index: null,
        nextPost: {},
        prevPost: {}
    },
    blocksData: {},
    siteSettings: {},
    userAccountMenu: [],
    error: {}
};
const defaultReducers = {
    setPageStatus: (state, action) => {
        state[PAGE_STATUS] = action.payload;
    },
    setPageData: (state, action) => {
        state.pageData = action.payload;
    },
    setPageDataOptions: (state, action) => {
        state.pageDataOptions = action.payload;
    },
    setPostData: (state, action) => {
        state.postData = action.payload;
    },
    setPostListData: (state, action) => {
        state.postListData = action.payload;
    },
    setPostNavFromList: (state, action) => {
        state.postNavData.fromList = action.payload;
    },
    setPostNavIndex: (state, action) => {
        state.postNavData.index = action.payload;
    },
    setPrevPostNavData: (state, action) => {
        state.postNavData.prevPost = action.payload;
    },
    setNextPostNavData: (state, action) => {
        state.postNavData.nextPost = action.payload;
    },
    setSiteSettings: (state, action) => {
        state.siteSettings = action.payload;
    },
    setBlocksData: (state, action) => {
        state.blocksData = action.payload;
    },
    setUserAccountMenuData: (state, action) => {
        state.userAccountMenu = action.payload;
    },
    setSearchParamPage: (state, action) => {
        state.searchParams.page = action.payload;
    },
    setSearchParamSortOrder: (state, action) => {
        state.searchParams.sort_order = action.payload;
    },
    setSearchParamSortBy: (state, action) => {
        state.searchParams.sort_by = action.payload;
    },
    setSearchParamQuery: (state, action) => {
        state.searchParams.query = action.payload;
    },
    setSearchParamPageSize: (state, action) => {
        state.searchParams.page_size = action.payload;
    },
    setPageError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const pageSlice = createSlice({
    name: "page",
    initialState: getState("page", defaultState),
    reducers: getReducers("page", defaultReducers)
});

export const pageReducer = pageSlice.reducer;
export const {
    setPageData, setPageDataOptions, setPostData, setPrevPostNavData,
    setNextPostNavData, setPostListData,
    setPostNavIndex, setPostNavFromList,
    setSiteSettings, setUserAccountMenuData,
    setPageError, setSearchParamPage,
    setSearchParamSortOrder, setSearchParamSortBy,
    setSearchParamQuery, setSearchParamPageSize,
    setPageStatus
} = pageSlice.actions;
