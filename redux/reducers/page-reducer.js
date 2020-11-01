// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";

const defaultState = {
    pageData: {},
    blocksData: {},
    siteSettings: {},
    leftSidebar: [],
    rightSidebar: [],
    blogSidebar: [],
    navBar: [],
    footer: [],
    userAccountMenu: [],
    modal: {
        show: false,
        component: "",
        data: {}
    },
    error: {}
};
const defaultReducers = {
    setPageData: (state, action) => {
        state.pageData = action.payload;
    },
    setSiteSettings: (state, action) => {
        state.siteSettings = action.payload;
    },
    setBlocksData: (state, action) => {
        state.blocksData = action.payload;
    },
    setLeftSidebarData: (state, action) => {
        state.leftSidebar = action.payload;
    },
    setRightSidebarData: (state, action) => {
        state.rightSidebar = action.payload;
    },
    setBlogSidebarData: (state, action) => {
        state.blogSidebar = action.payload;
    },
    setNavBarData: (state, action) => {
        state.navBar = action.payload;
    },
    setFooterData: (state, action) => {
        state.footer = action.payload;
    },
    setShowModal: (state, action) => {
        state.modal.show = action.payload;
    },
    setModalComponent: (state, action) => {
        state.modal = action.payload;
    },
    setUserAccountMenuData: (state, action) => {
        state.userAccountMenu = action.payload;
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
    setPageData, setBlocksData,
    setSiteSettings, setRightSidebarData,
    setBlogSidebarData,
    setLeftSidebarData, setNavBarData,
    setFooterData, setUserAccountMenuData,
    setPageError, setShowModal,
    setModalComponent
} = pageSlice.actions;