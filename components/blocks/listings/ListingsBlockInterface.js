import React, {useContext, useEffect, useState} from 'react';
import {
    DISPLAY_AS,
    DISPLAY_AS_COMPARISONS,
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST_LIST,
    DISPLAY_AS_SIDEBAR_LIST,
    DISPLAY_AS_SIDEBAR_POST, DISPLAY_AS_TILES,
} from "@/truvoicer-base/redux/constants/general_constants";
import {ListingsContext, listingsData} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext, searchData} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import ListingsBlockContainer from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import GridItems from "@/truvoicer-base/components/blocks/listings/items/GridItems";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import PostItemListPost from "@/views/Components/Blocks/Listings/Templates/Recruitment/Post/PostItemListPost";
import PostInfoModal from "@/views/Components/Blocks/Listings/Templates/Recruitment/Post/PostInfoModal";
import ListDisplay from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/ListDisplay";
import NewsPostItemListPost from "@/views/Components/Blocks/Listings/Templates/News/Post/PostItemListPost";
import NewsPostInfoModal from "@/views/Components/Blocks/Listings/Templates/News/Post/PostInfoModal";
import NewsListDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/ListDisplay";
import CamsPostItemListPost from "@/views/Components/Blocks/Listings/Templates/Cams/Post/PostItemListPost";
import CamsPostInfoModal from "@/views/Components/Blocks/Listings/Templates/Cams/Post/PostInfoModal";
import CamsListDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/ListDisplay";
import ItemList from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/ItemList";
import InfoModal from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/InfoModal";
import ItemView from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/ItemView";
import NewsItemList from "@/views/Components/Blocks/Listings/Templates/News/List/ItemList";
import NewsInfoModal from "@/views/Components/Blocks/Listings/Templates/News/List/InfoModal";
import CamsItemList from "@/views/Components/Blocks/Listings/Templates/Cams/List/ItemList";
import CamsInfoModal from "@/views/Components/Blocks/Listings/Templates/Cams/List/InfoModal";
import SidebarItemList from "@/views/Components/Blocks/Listings/Templates/Recruitment/List/SidebarItemList";
import SidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/SidebarDisplay";
import NewsSidebarItemList from "@/views/Components/Blocks/Listings/Templates/News/List/SidebarItemList";
import NewsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/SidebarDisplay";
import CamsSidebarItemList from "@/views/Components/Blocks/Listings/Templates/Cams/List/SidebarItemList";
import CamsSidebarDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/SidebarDisplay";
import SidebarPostItem from "@/views/Components/Blocks/Listings/Templates/Recruitment/Post/SidebarPostItem";
import NewsSidebarPostItem from "@/views/Components/Blocks/Listings/Templates/News/Post/SidebarPostItem";
import CamsSidebarPostItem from "@/views/Components/Blocks/Listings/Templates/Cams/Post/SidebarPostItem";
import ComparisonsItemList
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsItemList";
import ComparisonDisplay
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/comparisons/ComparisonDisplay";
import ComparisonsInfoModal
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsInfoModal";
import ComparisonsItemView
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Comparisons/ComparisonsItemView";
import HorizontalComparisons
    from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/comparisons/HorizontalComparisons";
import TileDisplay from "@/views/Components/Blocks/Listings/Templates/Recruitment/Layout/TileDisplay";
import NewsTileDisplay from "@/views/Components/Blocks/Listings/Templates/News/Layout/TileDisplay";
import CamsTileDisplay from "@/views/Components/Blocks/Listings/Templates/Cams/Layout/TileDisplay";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsBlockInterface = (props) => {
    const {data} = props;

    const listingsGrid = new ListingsGrid();

    const [listingsContextState, setListingsContextState] = useState({
        ...listingsData,
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

    function getListingService() {
        switch (listingsContextState?.listingsData?.source) {
            case 'api':
                return data?.api_listings_service;
            case 'wordpress':
                return data?.listings_category;
            default:
                return null;
        }
    }

    // const loadListings = () => {
    //     if (!isNotEmpty(data?.[DISPLAY_AS])) {
    //         return null;
    //     }
    //     const service = getListingService();
    //     if (!service) {
    //         return null;
    //     }
    //     const layoutCompoent = listingsGrid.getTemplateListingComponent({
    //         displayAs: data[DISPLAY_AS],
    //         category: service,
    //         template: data?.template,
    //         component: 'layout',
    //         props: props
    //     });
    //
    //     if (!layoutCompoent) {
    //         console.log(data)
    //         console.warn(`No layout component found for display as: ${data[DISPLAY_AS]} | category: ${service}`);
    //         return null
    //     }
    //     return layoutCompoent;
    // }

    function getExtraListingsData() {
        let extraData = {};
        if (isNotEmpty(data?.grid_layout)) {
            extraData = {
                listingsGrid: data.grid_layout
            }
        }
        return extraData;
    }

    const listingsManager = new ListingsManager(listingsContextState, searchContextState);
    const service = getListingService();
    console.log(service, data?.[DISPLAY_AS] === [DISPLAY_AS_TILES] && service === 'news',  data)
    useEffect(() => {
        if (!listingsContextState.loaded) {
            return;
        }
        listingsManager.runSearch('');
    }, [listingsContextState.loaded]);
    return (
        <ListingsContext.Provider value={listingsContextState}>
            <SearchContext.Provider value={searchContextState}>
                <ListingsBlockContainer data={data}>
                    <GridItems>
                        {data?.[DISPLAY_AS] === DISPLAY_AS_POST_LIST && service === 'recruitment' && (
                            <ListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_POST_LIST && service === 'news' && (

                            <NewsListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_POST_LIST && service === 'cams' && (

                            <CamsListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_LIST && service === 'recruitment' && (
                            <ListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_LIST && service === 'news' && (
                            <NewsListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_LIST && service === 'cams' && (
                            <CamsListDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_LIST && service === 'recruitment' && (
                            <SidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_LIST && service === 'news' && (
                            <NewsSidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_LIST && service === 'cams' && (
                            <CamsSidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_POST && service === 'recruitment' && (
                            <SidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_POST && service === 'news' && (
                            <NewsSidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_SIDEBAR_POST && service === 'cams' && (
                            <CamsSidebarDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_TILES && service === 'recruitment' && (
                            <TileDisplay {...props} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_TILES && service === 'news' && (
                            <NewsTileDisplay {...props} testData={searchContextState.searchList} />
                        )}
                        {data?.[DISPLAY_AS] === DISPLAY_AS_TILES && service === 'cams' && (
                            <CamsTileDisplay {...props} />
                        )}

                    </GridItems>
                </ListingsBlockContainer>
            </SearchContext.Provider>
        </ListingsContext.Provider>
    );
};
ListingsBlockInterface.category = 'listings';
ListingsBlockInterface.templateId = 'listingsBlockInterface';
export default ListingsBlockInterface;
