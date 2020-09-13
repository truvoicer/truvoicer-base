// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    SESSION_AUTH_TYPE,
    SESSION_AUTHENTICATED, SESSION_ERROR, SESSION_SAVED_ITEMS,
    SESSION_USER,
    SESSION_USER_DISPLAY_NAME,
    SESSION_USER_EMAIL,
    SESSION_USER_FIRSTNAME,
    SESSION_USER_ID, SESSION_USER_LASTNAME,
    SESSION_USER_NICE_NAME, SESSION_USER_TOKEN
} from "../constants/session-constants";

const sessionState = {
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
    [SESSION_AUTHENTICATED]: false,
    [SESSION_ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};

export const sessionSlice = createSlice({
    name: "session",
    initialState: sessionState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload;
        },
        setSessionError: (state, action) => {
            state.error = action.payload;
            console.error(state.error)
        },
    },
});

export const sessionReducer = sessionSlice.reducer;
export const {setUser, setToken, setAuthenticated, setSessionError} = sessionSlice.actions;