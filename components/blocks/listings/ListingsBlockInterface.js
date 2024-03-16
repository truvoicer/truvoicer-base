import React, {useState} from 'react';
import FetcherApiListingsBlock from "./sources/fetcher-api/FetcherApiListingsBlock";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS, LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import PostsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/PostsBlock";

const ListingsBlockInterface = ({data}) => {

    function getWpListings() {
        switch (data?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                return <FetcherApiListingsBlock data={data}/>
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                return <PostsBlock data={data}/>
            default:
                return null;
        }
    }
    const loadListings = () => {
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return getWpListings();
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
