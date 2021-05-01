import {reduxConfig} from "../../../config/redux-config";
import {isNotEmpty} from "../utils";

/**
 * Checks for additional state data for a specific state
 * Checks in a state config in the parent redux/reducers/(state_name).js config file
 * @param key
 * @param defaultState
 * @returns {*}
 */
export const getState = (key, defaultState) => {
    try {
        if(!isNotEmpty(reduxConfig[key])) {
            return defaultState;
        }
        const stateConfig = reduxConfig[key]?.stateConfig;
        if (isNotEmpty(stateConfig)) {
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
        if(!isNotEmpty(reduxConfig[key])) {
            return defaultReducers;
        }
        const reducerConfig = reduxConfig[key]?.reducerConfig;
        if (isNotEmpty(reducerConfig)) {
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
        const storeReducers = reduxConfig?.store?.reducers;
        if (isNotEmpty(storeReducers)) {
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