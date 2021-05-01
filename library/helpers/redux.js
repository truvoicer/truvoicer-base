/**
 * Checks for additional state data for a specific state
 * Checks in a state config in the parent redux/reducers/(state_name).js config file
 * @param key
 * @param defaultState
 * @returns {*}
 */
export const getState = (key, defaultState) => {
    try {
        const stateFile = require("../../../library/redux/reducersgh/" + key);
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

/**
 * Checks for additional reducers to add to the store
 * Checks in a state config in the parent redux/reducers/(reducer_name).js config file
 * @param key
 * @param defaultReducers
 * @returns {*}
 */
export const getReducers = (key, defaultReducers) => {
    try {
        const reducerFile = require("../../../library/redux/reducers/" + key);
        const reducerConfig = reducerFile.reducerConfig;
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