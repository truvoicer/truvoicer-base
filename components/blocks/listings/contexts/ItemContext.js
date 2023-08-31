import React from 'react'

export const itemData = {
    data: {},
    provider: "",
    category: "",
    itemId: "",
    error: {},
    updateData: () => {},
    updateNestedObjectData: () => {}
};

export const ItemContext = React.createContext(itemData);
