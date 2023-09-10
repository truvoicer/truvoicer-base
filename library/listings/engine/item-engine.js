import {
    convertImageObjectsToArray,
    formatDate,
    isNotEmpty, isObject,
    isObjectEmpty,
    isSet,
    uCaseFirst
} from "@/truvoicer-base/library/utils";
import store from "@/truvoicer-base/redux/store";
import HtmlParser from "react-html-parser";
import ImageLoader from "@/truvoicer-base/components/loaders/ImageLoader";
import ListLoader from "@/truvoicer-base/components/loaders/ListLoader";
import React from "react";
import {siteConfig} from "@/config/site-config";
import {listingsGridConfig} from "@/config/listings-grid-config";
import {getItemRatingDataAction, isSavedItemAction} from "@/truvoicer-base/redux/actions/user-stored-items-actions";
import {tagManagerSendDataLayer} from "@/truvoicer-base/library/api/global-scripts";
import {getItemViewUrl} from "@/truvoicer-base/redux/actions/item-actions";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {produce} from "immer";
import {NEW_SEARCH_REQUEST} from "@/truvoicer-base/redux/constants/search-constants";
import {setItemRatingsList, setSavedItemsList} from "@/truvoicer-base/redux/reducers/search-reducer";
import {filterItemIdDataType} from "@/truvoicer-base/library/helpers/items";
import {setModalContentAction} from "@/truvoicer-base/redux/actions/page-actions";
import {componentsConfig} from "@/config/components-config";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_CUSTOM, LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "@/truvoicer-base/redux/constants/listings-constants";
import Image from "react-bootstrap/Image";
import {
    setItemCategory,
    setItemData,
    setItemError,
    setItemId,
    setItemProvider
} from "@/truvoicer-base/redux/reducers/item-reducer";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {sprintf} from "sprintf";
import {ItemRoutes} from "@/config/item-routes";
import {ListingsEngineBase} from "@/truvoicer-base/library/listings/engine/listings-engine-base";


export class ItemEngine {
    constructor(context) {
        this.setItemContext(context);
    }

    setItemContext(context) {
        this.itemContext = context;
    }

    updateContext({key, value}) {
        this.itemContext.updateData({key, value})
    }

    addError(error) {
        this.updateContext({key: "error", value: error})
    }

    setItemErrorAction(error) {
        this.addError(error)
    }
    setItemCategoryAction(category) {
        this.updateContext({key: "category", value: category})
    }
    setItemProviderAction(provider) {
        this.updateContext({key: "provider", value: provider})
    }
    setItemIdAction(itemId) {
        this.updateContext({key: "itemId", value: itemId})
    }

    setItemDataAction(itemData) {
        const itemDataState = {...store.getState().item.data};
        const object = Object.assign({}, itemDataState, itemData);
        this.updateContext({key: "data", value: object})
    }

    getItemAction(requestData) {
        fetchData("operation", ["single"], requestData, this.fetchItemCallback)
    }

    fetchLoaderDataAction(operation, requestData, callback) {
        fetchData("operation", [operation], requestData, callback)
    }

    fetchItemCallback (status, data) {
        if (status === 200) {
            this.setItemDataAction(data.request_data[0])
        } else {
            console.error(data)
            this.addError("Item fetch error...")
        }
    }

    setSingleItemPostState({databaseId, dataKeys = null}) {
        if (!isNotEmpty(dataKeys)) {
            console.error("Single Item data keys is either empty or undefined.")
            return;
        }

        // const parseJson = JSON.parse(dataKeys)
        // if (!Array.isArray(parseJson?.api_data_keys_list)) {
        //     console.error("Single item (api_data_keys_list) is not a valid array.")
        //     return;
        // }

        // let dataKeyObject = buildDataKeyObject(parseJson.api_data_keys_list, databaseId);
        this.setItemIdAction(databaseId)
        this.setItemDataAction(dataKeys)
    }

    getCustomItem = (item, category) => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[category])) {
            return null;
        }
        if (!isSet(gridConfig[category][LISTINGS_GRID_CUSTOM])) {
            return null;
        }
        const CustomItem = gridConfig[category][LISTINGS_GRID_CUSTOM];
        return <CustomItem data={item} />
    }


    getGridItemColumns = (listingsGrid) => {
        switch (listingsGrid) {
            case LISTINGS_GRID_COMPACT:
                return {
                    sm: 12,
                    md: 6,
                    lg: 4
                };
            case LISTINGS_GRID_LIST:
                return {
                    sm: 12,
                    md: 12,
                    lg: 12
                };
            case LISTINGS_GRID_DETAILED:
                return {
                    sm: 12,
                    md: 6,
                    lg: 6
                };
            default:
                return {
                    sm: 12,
                    md: 6,
                    lg: 4
                };
        }
    }

    getItemViewUrl(item, category) {
        let data = {
            item_id: item.item_id
        }
        if (item?.custom_item) {
            return sprintf(ItemRoutes.internalItemView, data);
        } else if (isNotEmpty(item?.provider)) {
            data.category = category
            data.provider = item.provider
            return sprintf(ItemRoutes.externalItemView, data);
        } else {
            return null;
        }
    }

    getComparisonItemViewUrl(item, category) {
        let data = {
            item_slug: item.item_slug,
            listings_category: category
        }

        return sprintf(ItemRoutes.comparisonItemView, data);
    }

    replaceItemDataPlaceholders(pageTitle, item) {
        const test = new RegExp("\\\[+(.*?)\\]", "g");
        return pageTitle.replace(test, (match, value) => {
            if (isSet(item[value])) {
                return uCaseFirst(item[value]);
            }
            return "loading..."
        });
    }

     itemDataTextFilter(text) {
        const itemState = {...store.getState().item};
        const postDataState = {...store.getState().page.postData};

        if (!isNotEmpty(text)) {
            return "";
        }
        if (isNotEmpty(postDataState)) {
            if (!isObjectEmpty(postDataState)) {
                return this.replaceItemDataPlaceholders(text, {
                    post_title: postDataState.title,
                    title: postDataState.title
                })
            }
        }
        if (isNotEmpty(itemState.itemId)) {
            if (!isObjectEmpty(itemState.data)) {
                return this.replaceItemDataPlaceholders(text, itemState.data)
            }
            return "Loading...";
        }
        return text;
    }

     convertLinkToHttps(url) {
        if (!isNotEmpty(url)) {
            return url;
        }
        if (url.includes("http:")) {
            url = url.replace("http:", "https:")
        }
        return url;
    }

    getItemImage(url, label) {
        return <Image src={this.convertLinkToHttps(url)} alt={label}/>
    }

    getItemLink(url, label) {
        return <a href={url}>{label}</a>
    }

    getItemDate(dateString) {
        return <div>{formatDate(dateString)}</div>
    }

    getItemText(text) {
        return <div>{HtmlParser(text)}</div>
    }

    getItemPrice(price) {
        return <div>{price}</div>
    }

    getItemList(config, data) {
        if (!isSet(config) || !isSet(data)) {
            return null;
        }
        if (!Array.isArray(config.keys) || !Array.isArray(data)) {
            return null;
        }
        return (
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        {config.keys.map((key, keyIndex) => (
                            <div key={keyIndex}>
                                {this.getItemContentType(key.type, key.name, item, key)}
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        )
    }

    getListIds(data, itemId) {
        if (!isSet(data) || data === null || data === "") {
            return itemId;
        }
        if (Array.isArray(data)) {
            return data.join(",");
        }
        return data;
    }

    getItemContentComponent(type, key, dataItem, config = null) {
        switch (type) {
            case "image":
                return <ImageLoader
                    item={dataItem}
                    imageData={dataItem[key]}
                />;
            case "list":
                return <ListLoader
                    item={dataItem}
                    listIds={this.getListIds(dataItem[key]?.data, dataItem?.item_id)}
                    listData={dataItem[key]}
                    listKeys={config.config.keys}
                />;
            default:
                return this.getItemContentType(type, key, dataItem, config);
        }
    }

     getItemContentType(type, key, dataItem, config = null) {
        switch (type) {
            case "image":
                return this.getItemImage(dataItem[key], config.label);
            case "link":
                return this.getItemLink(dataItem[key], config.label);
            case "date":
                return this.getItemDate(dataItem[key]);
            case "price":
                return this.getItemPrice(dataItem[key]);
            case "list":
                return this.getItemList(config.config, dataItem[key]);
            default:
                return this.getItemText(dataItem[key]);
        }
    }

    getItemContent(type, key, dataItem, config = null) {
        if (isSet(dataItem[key]) &&
            dataItem[key] !== null &&
            isSet(dataItem[key].request_item) &&
            isSet(dataItem[key].request_item.request_operation)
        ) {
            return this.getItemContentComponent(type, key, dataItem, config)
        }
        return this.getItemContentType(type, key, dataItem, config);
    }

     getListItemData(item, dataItem) {
        return (
            <>
                {!Array.isArray(item.dataKey)
                    ?
                    <>
                        {this.getItemContent(item.type, item.dataKey, dataItem, item)}
                    </>
                    :
                    <>
                        {item.dataKey.map((dataKeyName, keyIndex) => (
                            <React.Fragment key={keyIndex.toString()}>
                                {this.getItemContent(item.type, item.dataKey, dataItem, item)}
                            </React.Fragment>
                        ))}
                    </>
                }
            </>
        )
    }

     getDataKeyValue(dataItem) {
        switch (dataItem.value_type) {
            case "text":
                return dataItem.data_item_value;
            case "url":
                return dataItem.data_item_value;
            case "color":
                return dataItem.data_item_value;
            case "html":
                return dataItem.data_item_value;
            case "number":
                return parseInt(dataItem.data_item_value)
            case "date":
                return dataItem.data_item_value;
            case "true_false":
                return dataItem.data_item_value === true || dataItem.data_item_value === "true";
            case "image":
                return dataItem.data_item_value;
            case "image_list":
                return dataItem.data_item_value;
            case "array":
                return dataItem.data_item_value;
            default:
                return null;
        }
    }

    buildDataKeyObject(dataKeyList, itemId, itemSlug = null) {
        let cloneDataKeyList = {...dataKeyList};
        let dataKeyObject = this.convertDataKeysDataArray(cloneDataKeyList);
        return this.renderDataKeyObject(dataKeyObject, itemId, itemSlug);
    }

    renderDataKeyObject(dataKeyObject = {}, itemId, itemSlug = null) {
        dataKeyObject.item_id = itemId;
        if (isNotEmpty(itemSlug)) {
            dataKeyObject.item_slug = itemSlug;
        }
        dataKeyObject.provider = siteConfig.internalProviderName;
        dataKeyObject.category = siteConfig.internalCategory;
        dataKeyObject.custom_item = true;
        return dataKeyObject;
    }

    convertDataKeysDataArrayObject(dataKeyList) {
        let dataKeyObject = {};
        dataKeyList.map((item) => {
            dataKeyObject[item.data_item_key] = this.getDataKeyValue(item)
        })
        return dataKeyObject;
    }
    convertDataKeysDataArray(dataKeyList) {
        let dataKeyObject = {};
        // dataKeyList.map((item) => {
        //     dataKeyObject[item.data_item_key] = getDataKeyValue(item)
        // })
        return dataKeyList;
    }

    buildCustomItem(item) {
        if (!item) {
            return null;
        }
        const dataKeyList = item.data.api_data_keys_list;
        return this.buildDataKeyObject(dataKeyList, item.post_type.ID);
    }

    buildCustomItemsArray(itemsData) {
        return itemsData.map(item => {
            if (
                item.item_type !== "post" ||
                !Array.isArray(item.item_post?.data?.api_data_keys_list)
            ) {
                return null;
            }
            return this.buildCustomItem(item.item_post)
        });
    }

    getGridItem(item, category, listingsGrid, userId, showInfoCallback, index = false) {
        let gridItem = {...item};
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[category])) {
            return null;
        }
        if (!isSet(gridConfig[category][listingsGrid])) {
            return null;
        }
        const GridItems = gridConfig[category][listingsGrid];
        return (
            <GridItems
                index={index}
                data={gridItem}
                searchCategory={category}
                showInfoCallback={showInfoCallback}
                savedItem={
                    this.isSavedItemAction(
                        isSet(item?.item_id) ? item.item_id : null,
                        isSet(item?.provider) ? item.provider : null,
                        category,
                        userId
                    )
                }
                ratingsData={
                    this.getItemRatingDataAction(
                        isSet(item?.item_id) ? item.item_id : null,
                        isSet(item?.provider) ? item.provider : null,
                        category,
                        userId
                    )
                }
            />
        )
    }

    globalItemLinkClick(trackData = {}) {
        tagManagerSendDataLayer(trackData)
    }

    getItemLinkProps(category, item, showInfoCallback, e, trackData = {}) {
        const listingsData = store.getState().listings?.listingsData;
        if (isSet(listingsData?.item_view_display) && listingsData.item_view_display === "page") {
            return {
                onClick: (e) => {
                    // e.preventDefault()
                    this.globalItemLinkClick(trackData)
                }
            };
        }
        return {
            href: this.getItemViewUrl(item, category),
            onClick: showInfoCallback.bind(e, item, category)
        }
    }
    extractItemListFromPost({post}) {
        if (!Array.isArray(post?.item_list?.item_list)) {
            return false;
        }
        let listData = [];
        const itemListData = post?.item_list?.item_list;
        itemListData.forEach(item => {
            switch (item.type) {
                case "single_item":
                    if (!item?.single_item_id?.ID) {
                        return;
                    }
                    if (!item?.single_item_id?.post_name) {
                        return;
                    }
                    if (!isObject(item?.single_item_id?.api_data_keys?.data_keys)) {
                        return;
                    }
                    listData.push(this.buildDataKeyObject(
                        item?.single_item_id?.api_data_keys.data_keys,
                        item?.single_item_id?.ID,
                        item?.single_item_id?.post_name
                    ));
                    break;
            }
        });
        return listData;
    }
    extractItemListFromPostArray({posts = []}) {
        if (!Array.isArray(posts)) {
            return [];
        }
        let listData = [];
        posts.forEach(post => {
            listData.push({
                ID: post?.ID,
                post_title: post?.post_title,
                post_type: post?.post_type,
                item_list: this.extractItemListFromPost({post})
            })
        })
        return listData;
    }

    getUserItemsListAction(data, provider, category) {
        if (data.length === 0) {
            return false;
        }
        const session = {...store.getState().session};

        if (!session[SESSION_AUTHENTICATED]) {
            return;
        }
        const userId = session[SESSION_USER][SESSION_USER_ID]

        const itemsList = data.map((item) =>  {
            return item.item_id;
        })

        const requestData = {
            provider_name: provider,
            category: category,
            id_list: itemsList,
            user_id: userId
        }
        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsList),
            requestData,
            this.getUserItemsListCallback
        )
    }

    getUserItemsListCallback(error, data) {
        if (error) {
            return false;
        }
        console.log({data})
        this.setSavedItemsListAction(data?.savedItems || []);
        this.setItemRatingsListAction(data?.itemRatings || []);
    }

}
