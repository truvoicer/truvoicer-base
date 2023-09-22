import React from 'react'

export const appContextData = {
    contexts: {},
    addContext: () => {},
    updateContext: () => {},
};
export const AppContext = React.createContext(appContextData);
