import store from "@/truvoicer-base/redux/store";
import {isSet, isEmpty, isNotEmpty, isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {tagManagerSendDataLayer} from "@/truvoicer-base/library/api/global-scripts";
import {sprintf} from "sprintf";
import {ItemRoutes} from "@/config/item-routes";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";

export class ListingsEngine {
    constructor(context) {
        this.setListingsContext(context);
    }

    setListingsContext(context) {
        this.listingsContext = context;
    }


    updateContext({key, value}) {
        this.listingsContext.updateData({key, value})
    }
    updateContextNestedObjectData({object, key, value}) {
        this.listingsContext.updateNestedObjectData({object, key, value})
    }

    updateListingsData({key, value}) {
        this.updateContextNestedObjectData({object: "listingsData", key, value})
    }

    addError(error) {
        this.updateContext({key: "error", value: error})
    }

    getListingsProviders({api_listings_category, select_providers, providers_list}, endpoint = "providers", callback) {
        if (isSet(select_providers) && select_providers && Array.isArray(providers_list)) {
            fetchData("list", [api_listings_category, endpoint], {provider: providers_list}, callback);
        } else {
            fetchData("list", [api_listings_category, endpoint], {}, callback);
        }
    }

    addArrayItem(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        const object = Object.assign({}, listingsQueryData, {
            [key]: (isSet(listingsQueryData[key])) ? listingsQueryData[key].concat(value) : [value]
        });
        this.updateContext({key: "listingsQueryData", value: object})
    }

    removeArrayItem(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        let index = listingsQueryData[key].indexOf(value);
        const newArray = [...listingsQueryData[key]]
        newArray.splice(index, 1)
        if (index === -1) return;

        const object = Object.assign({}, listingsQueryData, {
            [key]: newArray
        });
        this.updateContext({key: "listingsQueryData", value: object})
    }

    addListingsQueryDataString(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        this.updateContext({key: "listingsQueryData", value: object})
    }

    addQueryDataObjectMiddleware(queryData, search = false) {
        let listingsQueryData = {...store.getState().listings.listingsQueryData}
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);
        this.updateContext({key: "listingsQueryData", value: object})
    }

    setListingsGridMiddleware(listingsGrid) {
        this.updateContext({key: "listingsGrid", value: listingsGrid})
    }

    addQueryDataString(key, value, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData

        const object = Object.assign({}, listingsQueryData, {
            [key]: value
        });
        this.updateContext({key: "listingsQueryData", value: object})
    }

    addQueryDataObjectAction(queryData, search = false) {
        let listingsQueryData = this.listingsContext?.listingsQueryData
        let newQueryData = {};
        Object.keys(queryData).map(value => {
            newQueryData[value] = queryData[value];

        });
        const object = Object.assign({}, listingsQueryData, newQueryData);

        this.updateContext({key: "listingsQueryData", value: object})
    }

    setListingsGridAction(listingsGrid) {
        this.updateContext({key: "listingsGrid", value: listingsGrid})
    }

    setListingsScrollTopAction(show) {
        this.updateContext({key: "listingsScrollTop", value: show})
    }

    getItemLinkProps(category, item, showInfoCallback, e, trackData = {}) {
        const listingsData = this.listingsContext?.listingsData;
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

    globalItemLinkClick(trackData = {}) {
        tagManagerSendDataLayer(trackData)
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


    getCustomItemsData(listPositions = []) {
        const listingsData = this.listingsContext?.listingsData;
        let itemsData;
        let listData = [];
        listPositions.forEach((listPosition) => {
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

            let listPosData = extractItemListFromPost({post: itemsData});
            if (!listPosData) {
                console.error('Invalid item list post data...')
                listPosData = [];
            }
            listData = [...listData, ...listPosData];
        })
        return listData;
    }

}
