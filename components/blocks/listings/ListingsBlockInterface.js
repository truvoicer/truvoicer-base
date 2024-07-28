import React, {useEffect, useRef, useState} from 'react';
import {
    DISPLAY_AS,
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {
    StateHelpers,
} from "@/truvoicer-base/library/helpers/state-helpers";
import {isNotEmpty, scrollToRef} from "@/truvoicer-base/library/utils";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {SESSION_IS_AUTHENTICATING} from "@/truvoicer-base/redux/constants/session-constants";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {connect} from "react-redux";
import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";
import {
    SEARCH_REQUEST_NEW,
} from "@/truvoicer-base/redux/constants/search-constants";
import {APP_LOADED, APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";


const ListingsBlockInterface = (props) => {
    const {data, session, app} = props;

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


    const myRef = useRef(null)
    if (listingsManager.listingsEngine?.listingsContext?.listingsScrollTop) {
        scrollToRef(myRef)
    }

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

        const layoutComponent = listingsGrid.getTemplateListingComponent({
            displayAs: data[DISPLAY_AS],
            category: service,
            template: data?.template,
            component: 'layout',
            props: props
        });

        if (!layoutComponent) {
            console.warn(`No layout component found for display as: ${data[DISPLAY_AS]} | category: ${service}`);
            return null
        }

        return layoutComponent;
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

    useEffect(() => {
        if (!app[APP_LOADED]) {
            return;
        }
        if (session[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        if (!isNotEmpty(data?.source)) {
            return;
        }
        if (listingsManager.listingsEngine.listingsContext.loaded) {
            return;
        }
        listingsManager.init(data);
        setProviders();
        listingsManager.listingsEngine.updateContext({key: 'loaded', value: true})
    }, [
        app[APP_LOADED],
        session[SESSION_IS_AUTHENTICATING],
        data?.source,
        listingsManager.listingsEngine.listingsContext.loaded
    ])

    useEffect(() => {
        if (!app[APP_LOADED]) {
            return;
        }
        if (!listingsManager.listingsEngine.listingsContext.loaded) {
            return;
        }
        if (!listingsManager.validateInitData()) {
            return;
        }
        listingsManager.searchEngine.updateContext({key: 'searchOperation', value: SEARCH_REQUEST_NEW})
    }, [
        listingsManager.listingsEngine.listingsContext.providers,
        listingsManager.listingsEngine.listingsContext.loaded,
    ]);

    useEffect(() => {
        if (!app[APP_LOADED]) {
            return;
        }
        if (!listingsManager.listingsEngine.listingsContext.loaded) {
            return;
        }
        if (!listingsManager.searchEngine.searchContext.searchStatus) {
            return;
        }

        listingsManager.prepareSearch('listDisplay news');
    }, [
        listingsManager.listingsEngine.listingsContext.loaded,
        listingsManager.searchEngine.searchContext.initialRequestHasRun,
        listingsManager.searchEngine.searchContext.searchStatus,
        listingsManager.searchEngine.searchContext.searchOperation,
    ]);

    useEffect(() => {
        if (!app[APP_LOADED]) {
            return;
        }
        if (!listingsManager.listingsEngine.listingsContext.loaded) {
            return;
        }
        if (!listingsManager.searchEngine.searchContext.searchStatus) {
            return;
        }

        listingsManager.runSearch();
    }, [
        listingsManager.listingsEngine.listingsContext.loaded,
        listingsManager.searchEngine.searchContext.initialRequestHasRun,
        listingsManager.searchEngine.searchContext.searchStatus,
        listingsManager.searchEngine.searchContext.searchOperation,
    ]);

    return (
        <ListingsContext.Provider value={StateHelpers.getStateData(listingsContextUseState)}>
            <SearchContext.Provider value={StateHelpers.getStateData(searchContextUseState)}>
                <ListingsBlockContainer>
                    <GridItems>
                        {loadListings()}
                    </GridItems>
                </ListingsBlockContainer>
            </SearchContext.Provider>
        </ListingsContext.Provider>
    );
};
ListingsBlockInterface.category = 'listings';
ListingsBlockInterface.templateId = 'listingsBlockInterface';

function mapStateToProps(state) {
    return {
        session: state.session,
        app: state[APP_STATE]
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockInterface);
