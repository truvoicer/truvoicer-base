export const getState = (key, defaultState) => {
    try {
        const stateFile = require("../../../library/redux/reducers/" + key);
        const stateConfig = stateFile.stateConfig;
        if (stateFile) {
            return {
                ...defaultState,
                ...stateConfig
            }
        }
    } catch (e) {
        return defaultState;
    }
    return defaultState;
};

export const getReducers = (key, defaultReducers) => {
    try {
        const reducerFile = require("../../../library/redux/reducers/" + key);
        const reducerConfig = stateFile.reducerConfig;
        if (reducerFile) {
            return {
                ...defaultReducers,
                ...reducerConfig
            }
        }

    } catch (e) {
        return defaultReducers;
    }
    return defaultReducers;
};

export const getStoreReducers = (defaultReducers) => {
    try {
        const storeFile = require("../../../library/redux/store");
        const storeReducers = storeFile.reducers;
        if (storeFile) {
            return {
                ...defaultReducers,
                ...storeReducers
            }
        }
    } catch (e) {
        return defaultReducers;
    }
    return defaultReducers;
};