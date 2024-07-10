import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {
    StateHelpers,
} from "@/truvoicer-base/library/helpers/state-helpers";
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


    let cloneListingsData = {...listingsData};
    cloneListingsData.listingsData = {
        ...cloneListingsData.listingsData,
        ...data

    };
    const listingsContextUseState = useState({
        ...cloneListingsData,
        ...getExtraListingsData(),
        updateData: ({key, value}) => {
            StateHelpers.updateStateObject({
                key,
                value,
                setStateObj: StateHelpers.getSetStateData(listingsContextUseState)
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            StateHelpers.updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: StateHelpers.getSetStateData(listingsContextUseState)
            })
        },
    })

    const searchContextUseState = useState({
        ...{...searchData},
        updateData: ({key, value}) => {
            StateHelpers.updateStateObject({
                key,
                value,
                setStateObj: StateHelpers.getSetStateData(searchContextUseState)
            })
        },
        updateNestedObjectData: ({object, key, value}) => {
            StateHelpers.updateStateNestedObjectData({
                object,
                key,
                value,
                setStateObj: StateHelpers.getSetStateData(searchContextUseState)
            })
        },
    })

    const listingsManager = new ListingsManager();
    listingsManager.setListingsContext(listingsContextUseState);
    listingsManager.setSearchContext(searchContextUseState)
    listingsManager.setDataStore(ListingsManagerBase.DATA_STORE_STATE);
    //
    async function setProviders() {
        const setProviders = await listingsManager.setListingsProviders(data)
    }

    useEffect(() => {
        if (session[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        if (!isNotEmpty(data?.source)) {
            return;
        }
        listingsManager.init(data);
        setProviders();
        listingsManager.listingsEngine.updateContext({key: 'loaded', value: true})
    }, [session, data?.source])

    useEffect(() => {
        if (!listingsManager.listingsEngine.listingsContext.loaded) {
            return;
        }
        if (!listingsManager.validateInitData()) {
            return;
        }

        listingsManager.runSearch('listDisplay news');
    }, [
        listingsManager.listingsEngine.listingsContext.providers,
        listingsManager.listingsEngine.listingsContext.loaded,
    ]);
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

    console.log('ListingInterface',
        listingsManager.listingsEngine?.listingsContext?.listingsData?.source,
        data,
        {...searchData},
        listingsManager.listingsEngine?.listingsContext,
        listingsManager.searchEngine?.searchContext
    )
    return (
        <ListingsContext.Provider value={StateHelpers.getStateData(listingsContextUseState)}>
            <SearchContext.Provider value={StateHelpers.getStateData(searchContextUseState)}>
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
