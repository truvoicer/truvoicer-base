import React, {useState} from 'react';
import FetcherApiListingsBlock from "./sources/fetcher-api/FetcherApiListingsBlock";
import PostsListingsBlock from "./sources/wp/posts/PostsListingsBlock";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";

const ListingsBlockInterface = ({data}) => {
    const loadListings = () => {
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return <PostsListingsBlock data={data}/>
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                return <FetcherApiListingsBlock data={data}/>
        }
    }
    const [listingsContextState, setListingsContextState] = useState({
        ...listingsData,
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setListingsContextState
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setListingsContextState
            })
        },
    })

    const [searchContextState, setSearchContextState] = useState({
        ...searchData,
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setSearchContextState
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: setSearchContextState
            })
        },
    })

    return (
            <ListingsContext.Provider value={listingsContextState}>
                <SearchContext.Provider value={searchContextState}>
                    {loadListings()}
                </SearchContext.Provider>
            </ListingsContext.Provider>
    );
};

export default ListingsBlockInterface;
