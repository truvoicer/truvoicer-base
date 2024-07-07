import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {isNotEmpty, isObject, isObjectEmpty, scrollToRef} from "@/truvoicer-base/library/utils";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {SESSION_IS_AUTHENTICATING} from "@/truvoicer-base/redux/constants/session-constants";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {connect} from "react-redux";
import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";


const ListingsBlockInterface = (props) => {
    const {data, session} = props;

    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const listingsGrid = new ListingsGrid();


    console.log({data, listingsData, searchData})
    const cloneListingsData = {...listingsData};
    const cloneSearchData = {...searchData};
    const listingsManager = new ListingsManager(cloneListingsData, cloneSearchData);
    listingsManager.setDataStore(ListingsManagerBase.DATA_STORE_VAR);
    listingsManager.init(data);
    listingsManager.runSearch('search');
    console.log({data, listingsData, searchData, cloneListingsData, cloneSearchData})
    const getListingsInitData = listingsManager.listingsEngine.getInitData() ?? {};
    const getSearchInitData = listingsManager.searchEngine.getInitData() ?? {};
    console.log('getListingsInitData', getListingsInitData)
    console.log('getSearchInitData', getSearchInitData)
    const [listingsContextState, setListingsContextState] = useState({
        ...getListingsInitData,
        ...getExtraListingsData(),
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
        ...getSearchInitData,
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


    // useEffect(() => {
    //     if (session[SESSION_IS_AUTHENTICATING]) {
    //         return;
    //     }
    // let cloneData = {...data}
    // if (!isObjectEmpty(listingsContext?.listingsData)) {
    //     return;
    // }
    // if (Array.isArray(cloneData?.listings_category_id)) {
    //     cloneData.listings_category = cloneData.listings_category_id[0]?.slug
    // }
    // listingsManager.setListingsBlocksDataAction(cloneData);
    // }, [session])

    // useEffect(() => {
    //     if (session[SESSION_IS_AUTHENTICATING]) {
    //         return;
    //     }
    //
    //     if (!listingsManager.validateInitData()) {
    //         return;
    //     }
    //     if (!listingsManager.validateSearchParams()) {
    //         return;
    //     }
    //     listingsManager.listingsEngine.updateContext({key: 'loaded', value: true})
    // }, [
    //     session,
    //     searchContext?.initialRequestHasRun,
    //     searchContext?.searchOperation,
    //     listingsContext.listingsData,
    //     listingsContext?.listingsQueryData,
    // ]);

    // useEffect(() => {
    //     if (!isObject(listingsContext?.listingsData) || isObjectEmpty(listingsContext?.listingsData)) {
    //         return;
    //     }
    //     const listingBlockId = listingsManager.getListingBlockId();
    //     if (!isNotEmpty(listingBlockId)) {
    //         return;
    //     }
    //     appManager.updateAppContexts({
    //         key: listingBlockId,
    //         value: {
    //             listingsContext: listingsContext,
    //             searchContext: searchContext,
    //         }
    //     })
    // }, [listingsContext, searchContext])

    // const myRef = useRef(null)
    // if (listingsContext?.listingsScrollTop) {
    //     scrollToRef(myRef)
    // }


    function getListingService(data) {
        switch (data?.source) {
            case 'api':
                return data?.api_listings_service;
            case 'wordpress':
                if (Array.isArray(data?.listings_category_id)) {
                    return data.listings_category_id[0]?.slug
                }
                return null;
            default:
                return null;
        }
    }

    const loadListings = () => {

        if (!isNotEmpty(data?.[DISPLAY_AS])) {
            return null;
        }

        const service = getListingService(data);

        if (!service) {
            return null;
        }

        const layoutCompoent = listingsGrid.getTemplateListingComponent({
            displayAs: data[DISPLAY_AS],
            category: service,
            template: data?.template,
            component: 'layout',
            props: props
        });

        if (!layoutCompoent) {
            console.warn(`No layout component found for display as: ${data[DISPLAY_AS]} | category: ${service}`);
            return null
        }

        return layoutCompoent;
    }

    function getExtraListingsData() {
        let extraData = {};
        if (isNotEmpty(data?.grid_layout)) {
            extraData = {
                listingsGrid: data.grid_layout
            }
        }
        return extraData;
    }

    // console.log('ListingInterface', data)
    return (
        <ListingsContext.Provider value={listingsContextState}>
            <SearchContext.Provider value={searchContextState}>
                <GridItems>
                    {loadListings()}
                </GridItems>
            </SearchContext.Provider>
        </ListingsContext.Provider>
    );
};
ListingsBlockInterface.category = 'listings';
ListingsBlockInterface.templateId = 'listingsBlockInterface';

function mapStateToProps(state) {
    return {
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockInterface);
