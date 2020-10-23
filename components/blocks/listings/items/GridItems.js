import React, {useState} from "react";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";
import {addListingsQueryDataString} from "../../../../redux/middleware/listings-middleware";
import {
    setSearchRequestOperationMiddleware,
    setSearchRequestStatusMiddleware,
} from "../../../../redux/middleware/search-middleware";
import {listingsGridConfig} from "../../../../../config/listings-grid-config";
import {convertImageObjectsToArray, isNotEmpty, isSet} from "../../../../library/utils";
import {SESSION_USER, SESSION_USER_ID} from "../../../../redux/constants/session-constants";
import {getItemRatingDataAction, isSavedItemAction,} from "../../../../redux/actions/user-stored-items-actions";
import Col from "react-bootstrap/Col";
import {useRouter} from "next/router";
import {getGridItemColumns, getItemViewUrl} from "../../../../redux/actions/item-actions";
import HtmlParser from "react-html-parser";
import {buildCustomItemsArray} from "../../../../library/helpers/items";

const GridItems = (props) => {
    const router = useRouter();
    const [modalData, setModalData] = useState({
        show: false,
        item: {},
        provider: ""
    });

    const showInfo = (item, category, e) => {
        if (isSet(props.listings.listingsData) &&
            isSet(props.listings.listingsData.item_display) &&
            props.listings.listingsData.item_display === "new_page"
        ) {
            const url = getItemViewUrl(item, category);
            router.push(url, url)
            // window.location.href = url
        } else {
            e.preventDefault()
            setModalData({
                show: true,
                item: item,
                provider: item.provider,
                category: category
            })
        }
    }

    const GetModal = () => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[props.search.category])) {
            return null
        }
        if (!isSet(gridConfig[props.search.category].modal)) {
            return null;
        }
        const ItemModal = gridConfig[props.search.category].modal;
        return <ItemModal data={modalData} category={props.search.category} close={closeModal}/>

    }

    const closeModal = () => {
        setModalData({
            show: false,
            item: modalData.item,
            provider: modalData.provider,
        })
    }

    const getGridItem = (item) => {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[props.search.category])) {
            return null;
        }
        if (!isSet(gridConfig[props.search.category][props.listings.listingsGrid])) {
            return null;
        }
        const GridItems = gridConfig[props.search.category][props.listings.listingsGrid];
        return <GridItems data={gridItem}
                          searchCategory={props.search.category}
                          showInfoCallback={showInfo}
                          savedItem={
                              isSavedItemAction(
                                  isSet(item.item_id)? item.item_id : null,
                                  isSet(item.provider)? item.provider : null,
                                  props.search.category,
                                  props.user[SESSION_USER_ID]
                              )
                          }
                          ratingsData={
                              getItemRatingDataAction(
                                  isSet(item.item_id)? item.item_id : null,
                                  isSet(item.provider)? item.provider : null,
                                  props.search.category,
                                  props.user[SESSION_USER_ID]
                              )
                          }
        />
    }

    const getCustomItemsData = (listPosition) => {
        const listingsData = props.listings.listingsData;
        let itemsData;
        switch (listPosition) {
            case "list_start":
                itemsData = listingsData?.list_start_items.data;
                break;
            case "list_end":
                itemsData = listingsData?.list_end_items.data;
                break;
            case "custom_position":
                itemsData = listingsData?.custom_position_items.data;
                break;
            default:
                return [];
        }
        if (!Array.isArray(itemsData) || itemsData.length === 0) {
            return [];
        }

        return buildCustomItemsArray(itemsData);
    }

    const insertListStartItems = (searchList) => {
        const itemsData = getCustomItemsData("list_start");
        if (itemsData.length === 0) {
            return searchList;
        }

        itemsData.map(item => {
            let itemCopy = {...item};
            itemCopy.custom_item = true;
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
            itemCopy.custom_item = true;
            searchList.push(itemCopy)
        })
        return searchList;
    }

    const insertCustomPositionItems = (searchList) => {
        const listingsData = props.listings.listingsData;
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
            itemCopy.custom_item = true;
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

    const getSearchList = () => {
        const customItemsListPosition = props.listings?.listingsData?.custom_items_list_position;
        if (!Array.isArray(customItemsListPosition) || customItemsListPosition.length === 0) {
            return props.search.searchList;
        }
        let searchList = [...props.search.searchList];

        if (customItemsListPosition.includes("list_start")) {
            searchList = insertListStartItems(searchList);
        }
        if (customItemsListPosition.includes("list_end")) {
            searchList = insertListEndItems(searchList)
        }
        if (customItemsListPosition.includes("custom_position")) {
            searchList = insertCustomPositionItems(searchList)
        }
        return searchList;
    }
    console.log(props.listings?.listingsData)
    return (
        <>
            <Row>
                {getSearchList().map((item, index) => (
                    <React.Fragment key={index}>
                        <Col {...getGridItemColumns(props.listings.listingsGrid)}>
                            {getGridItem(item)}
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
        listings: state.listings,
        search: state.search
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