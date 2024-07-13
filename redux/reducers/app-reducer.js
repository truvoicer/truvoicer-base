// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {getReducers, getState} from "../../library/helpers/redux";
import {APP_LOADED, APP_STATE, ERROR} from "@/truvoicer-base/redux/constants/app-constants";

const defaultState = {
    [APP_LOADED]: false,
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
export const {setAppLoaded, setError} = appSlice.actions;
