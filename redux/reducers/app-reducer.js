// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";
import {
    APP_CURRENT_ROUTE,
    APP_LOADED,
    APP_REQUESTED_ROUTE,
    APP_STATE,
    ERROR
} from "@/truvoicer-base/redux/constants/app-constants";

const defaultState = {
    [APP_LOADED]: false,
    [APP_CURRENT_ROUTE]: null,
    [APP_REQUESTED_ROUTE]: null,
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setAppLoaded: (state, action) => {
        state[APP_LOADED] = action.payload;
    },
    setAppCurrentRoute: (state, action) => {
        state[APP_CURRENT_ROUTE] = action.payload;
    },
    setAppRequestedRoute: (state, action) => {
        state[APP_REQUESTED_ROUTE] = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const appSlice = createSlice({
    name: APP_STATE,
    initialState: getState(APP_STATE, defaultState),
    reducers: getReducers(APP_STATE, defaultReducers),
});

export const appReducer = appSlice.reducer;
export const {setAppLoaded, setAppCurrentRoute, setAppRequestedRoute, setError} = appSlice.actions;
