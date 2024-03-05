import React from 'react';

export const fbAuthContextData = {
    appId: null,
    fb: {},
    isSignedIn: false,
    errors: [],
    update: () => {}
};
export const FbAuthContext = React.createContext(fbAuthContextData);
