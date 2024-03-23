import React, {useState} from 'react';
import {
    DISPLAY_AS, DISPLAY_AS_COMPARISONS, DISPLAY_AS_LIST, DISPLAY_AS_POST_LIST,
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS, LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST, LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import PostsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/PostsBlock";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import SearchListingsBlock
    from "@/truvoicer-base/components/blocks/listings/sources/fetcher-api/types/SearchListingsBlock";
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";

const ListingsBlockInterface = ({data}) => {

    function loadByWpDataSource() {
        switch (data?.wordpress_data_source) {
            case LISTINGS_BLOCK_WP_DATA_SOURCE_ITEM_LIST:
                return <SearchListingsBlock data={data}/>
            case LISTINGS_BLOCK_WP_DATA_SOURCE_POSTS:
                return <PostsBlock data={data}/>
            default:
                return null;
        }
    }
    function loadBySource() {
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return loadByWpDataSource();
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                return <SearchListingsBlock data={data}/>
        }
    }

    const loadByDisplayAs = () => {
        if (!isNotEmpty(data?.[DISPLAY_AS])) {
            return false;
        }

        switch (data[DISPLAY_AS]) {
            case DISPLAY_AS_POST_LIST:
                return <PostsBlock data={data}/>
            case DISPLAY_AS_LIST:
                return <SearchListingsBlock data={data}/>
            case DISPLAY_AS_COMPARISONS:
                return <SearchListingsBlock data={data}/>
            default:
                console.warn("No display type set");
                return null;
        }
    }
    const loadListings = () => {
        const load = loadByDisplayAs();
        if (!load) {
            return loadBySource();
        }
        return load;
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
                    <ListingsBlockContainer data={data}>
                        {loadListings()}
                    </ListingsBlockContainer>
                </SearchContext.Provider>
            </ListingsContext.Provider>
    );
};

export default ListingsBlockInterface;
