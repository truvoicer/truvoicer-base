// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";

const pageState = {
    pageData: {},
    blocksData: {},
    siteSettings: {},
    sidebar: [],
    topBar: [],
    footer: [],
    userAccountMenu: [],
    modal: {
        show: false,
        component: "",
        data: {}
    },
    error: {}
};

export const pageSlice = createSlice({
    name: "page",
    initialState: pageState,
    reducers: {
        setPageData: (state, action) => {
            state.pageData = action.payload;
        },
        setSiteSettings: (state, action) => {
            state.siteSettings = action.payload;
        },
        setBlocksData: (state, action) => {
            state.blocksData = action.payload;
        },
        setSidebarData: (state, action) => {
            state.sidebar = action.payload;
        },
        setTopBarData: (state, action) => {
            state.topBar = action.payload;
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
    },
});

export const pageReducer = pageSlice.reducer;
export const {
    setPageData, setBlocksData,
    setSiteSettings,
    setSidebarData, setTopBarData,
    setFooterData, setUserAccountMenuData,
    setPageError, setShowModal,
    setModalComponent
} = pageSlice.actions;