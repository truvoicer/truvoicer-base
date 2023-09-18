import React, {useState} from 'react';
import FetcherApiListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Sources/FetcherApi/FetcherApiListingsBlock";
import PostsListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Sources/Posts/PostsListingsBlock";
import {
    LISTINGS_BLOCK_SOURCE_API,
    LISTINGS_BLOCK_SOURCE_WORDPRESS
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {
    ListingsTemplateContext,
    listingsTemplateData
} from "@/truvoicer-base/library/listings/contexts/ListingsTemplateContext";

const ListingsBlockInterface = ({data, layout = null}) => {
    const loadListings = () => {
        switch (data?.source) {
            case LISTINGS_BLOCK_SOURCE_WORDPRESS:
                return <PostsListingsBlock data={data}/>
            case LISTINGS_BLOCK_SOURCE_API:
            default:
                return <FetcherApiListingsBlock data={data}/>
        }
    }
    const [listingsTemplateContextState, setListingsTemplateContextState] = useState({
        ...listingsTemplateData,
        ...{
            layout: layout,
        }
    })
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
        <ListingsTemplateContext.Provider value={listingsTemplateContextState}>
            <ListingsContext.Provider value={listingsContextState}>
                <SearchContext.Provider value={searchContextState}>
                    {loadListings()}
                </SearchContext.Provider>
            </ListingsContext.Provider>
        </ListingsTemplateContext.Provider>
    );
};

export default ListingsBlockInterface;
