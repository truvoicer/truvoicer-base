import React from 'react';

export const pinterestContextData = {
    appId: null,
    pinterest: {},
    isSignedIn: false,
    handleIntent: () => {},
    errors: [],
    update: () => {},
    logout: () => {},
};
export const PinterestContext = React.createContext(pinterestContextData);
