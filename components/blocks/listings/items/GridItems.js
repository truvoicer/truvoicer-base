import React, {useContext, useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../../../redux/middleware/listings-middleware";
import {
    setSearchRequestOperationMiddleware,
    setSearchRequestStatusMiddleware,
} from "../../../../redux/middleware/search-middleware";
import {listingsGridConfig} from "../../../../../config/listings-grid-config";
import {isNotEmpty, isSet} from "../../../../library/utils";
import {SESSION_USER, SESSION_USER_ID} from "../../../../redux/constants/session-constants";
import {
    getUserItemsListAction,
} from "../../../../redux/actions/user-stored-items-actions";
import Col from "react-bootstrap/Col";
import {useRouter} from "next/router";
import {getGridItemColumns} from "../../../../redux/actions/item-actions";
import {buildCustomItemsArray, extractItemListFromPost, getGridItem} from "../../../../library/helpers/items";
import {siteConfig} from "../../../../../config/site-config";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";

const GridItems = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        show: false,
        item: {},
        provider: ""
    });
    const [listPosition, setListPosition] = useState(null);
    // const [searchList, setSearchList] = useState([]);

    const showInfo = (item, category, e) => {
        e.preventDefault()
        setModalData({
            show: true,
            item: item,
            provider: item.provider,
            category: category
        })
    }

    const GetModal = () => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[searchContext.category])) {
            return null
        }
        if (!isSet(gridConfig[searchContext.category].modal)) {
            return null;
        }
        const ItemModal = gridConfig[searchContext.category].modal;
        return <ItemModal data={modalData} category={searchContext.category} close={closeModal}/>

    }

    const closeModal = () => {
        setModalData({
            show: false,
            item: modalData.item,
            provider: modalData.provider,
        })
    }

    const getCustomItemsData = (listPosition) => {
        const listingsData = listingsContext.listingsData;
        let itemsData;
        switch (listPosition) {
            case "list_start":
                itemsData = listingsData?.item_list_id__list_start_items;
                break;
            case "list_end":
                itemsData = listingsData?.item_list_id__list_end_items;
                break;
            case "custom_position":
                itemsData = listingsData?.item_list_id__custom_position_items;
                break;
            default:
                return [];
        }
        if (!itemsData) {
            return [];
        }

        let listData = extractItemListFromPost({post: itemsData});
        if (!listData) {
            console.error('Invalid item list post data...')
            listData = [];
        }
        return listData;
    }

    const insertListStartItems = (searchList) => {
        const itemsData = getCustomItemsData("list_start");
        if (itemsData.length === 0) {
            return searchList;
        }


        itemsData.map(item => {
            let itemCopy = {...item};
            searchList.unshift(itemCopy)
        })
        return searchList;
    }

    const insertListEndItems = (searchList) => {
        const itemsData = getCustomItemsData("list_end");
        if (itemsData.length === 0) {
            return searchList;
        }


        itemsData.map(item => {
            let itemCopy = {...item};
            searchList.push(itemCopy)
        })
        return searchList;
    }

    const insertCustomPositionItems = (searchList) => {
        const listingsData = listingsContext.listingsData;
        if (!isNotEmpty(listingsData.insert_index) || isNaN(listingsData.insert_index)) {
            return searchList;
        }
        if (!isNotEmpty(listingsData.per_page_count) || isNaN(listingsData.per_page_count)) {
            return searchList;
        }

        const listStartItemsCount = getCustomItemsData("list_start").length;

        let itemsData = getCustomItemsData("custom_position");
        const newSearchList = [];
        const newItemsData = [];
        if (itemsData.length === 0) {
            return searchList;
        }

        itemsData.map(item => {
            let itemCopy = {...item};
            newItemsData.push(itemCopy);
        });
        let insertCount = 0 - listStartItemsCount;
        let insertItemCount = 0;
        searchList.map((item) => {
            if (
                (insertCount % parseInt(listingsData.insert_index)) === 0 &&
                insertItemCount < parseInt(listingsData.per_page_count)
            ) {
                newSearchList.push(...newItemsData);
                insertItemCount++;
            }
            newSearchList.push(item)
            insertCount++;
        })
        return newSearchList;
    }

    useEffect(() => {
        if (isNotEmpty(listPosition)) {
            getUserItemsListAction(getSearchList(), siteConfig.internalProviderName, siteConfig.internalCategory)
        }
    }, [listPosition])

    useEffect(() => {

        if (listingsContext?.listingsData?.list_start) {
            setListPosition("list_start")
        }
        if (listingsContext?.listingsData?.list_end) {
            setListPosition("list_end")
        }
        if (listingsContext?.listingsData?.custom_position) {
            setListPosition("custom_position")
        }

    }, [
        listingsContext?.listingsData?.list_start,
        listingsContext?.listingsData?.list_end,
        listingsContext?.listingsData?.custom_position,
    ])

    function getSearchList() {
        let searchList = [...searchContext.searchList];
        if (
            !listingsContext?.listingsData?.list_start &&
            !listingsContext?.listingsData?.list_end &&
            !listingsContext?.listingsData?.custom_position
        ) {
            return searchList;
        }
        if (listingsContext?.listingsData?.list_start) {
            searchList = insertListStartItems(searchList);
        }
        if (listingsContext?.listingsData?.list_end) {
            searchList = insertListEndItems(searchList)
        }
        if (listingsContext?.listingsData?.custom_position) {
            searchList = insertCustomPositionItems(searchList)
        }
        return searchList;
    }
    return (
        <>
            <Row>
                {getSearchList().map((item, index) => (
                    <React.Fragment key={index}>
                        <Col {...getGridItemColumns(listingsContext.listingsGrid)}>
                            {getGridItem(
                                item,
                                searchContext.category,
                                listingsContext.listingsGrid,
                                props.user[SESSION_USER_ID],
                                showInfo,
                                index
                            )}
                        </Col>
                    </React.Fragment>
                ))}
            </Row>

            {modalData.show &&
            <GetModal/>
            }
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    {
        addListingsQueryDataString,
        setSearchRequestOperationMiddleware,
        setSearchRequestStatusMiddleware
    }
)(GridItems);
