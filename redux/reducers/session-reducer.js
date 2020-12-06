// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    SESSION_AUTH_TYPE,
    SESSION_AUTHENTICATED, SESSION_ERROR, SESSION_IS_AUTHENTICATING, SESSION_PASSWORD_RESET_KEY, SESSION_USER,
    SESSION_USER_DISPLAY_NAME,
    SESSION_USER_EMAIL,
    SESSION_USER_FIRSTNAME,
    SESSION_USER_ID, SESSION_USER_LASTNAME,
    SESSION_USER_NICE_NAME, SESSION_USER_TOKEN
} from "../constants/session-constants";
import {getReducers, getState} from "../../library/helpers/redux";

const defaultState = {
    [SESSION_USER]: {
        [SESSION_AUTH_TYPE]: "",
        [SESSION_USER_ID]: null,
        [SESSION_USER_EMAIL]: "",
        [SESSION_USER_NICE_NAME]: "",
        [SESSION_USER_FIRSTNAME]: "",
        [SESSION_USER_LASTNAME]: "",
        [SESSION_USER_DISPLAY_NAME]: "",
        [SESSION_USER_TOKEN]: "",
    },
    [SESSION_PASSWORD_RESET_KEY]: "",
    [SESSION_AUTHENTICATED]: false,
    [SESSION_IS_AUTHENTICATING]: true,
    [SESSION_ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setUser: (state, action) => {
        state.user = action.payload;
    },
    setUserId: (state, action) => {
        state.user[SESSION_USER_ID] = action.payload;
    },
    setToken: (state, action) => {
        state.token = action.payload;
    },
    setPasswordResetKey: (state, action) => {
        state.passwordResetKey = action.payload;
    },
    setAuthenticated: (state, action) => {
        state.authenticated = action.payload;
    },
    setIsAuthenticating: (state, action) => {
        state[SESSION_IS_AUTHENTICATING] = action.payload;
    },
    setSessionError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const sessionSlice = createSlice({
    name: "session",
    initialState: getState("session", defaultState),
    reducers: getReducers("session", defaultReducers),
});

export const sessionReducer = sessionSlice.reducer;
export const {setUser, setToken, setAuthenticated, setIsAuthenticating, setUserId, setPasswordResetKey, setSessionError} = sessionSlice.actions;