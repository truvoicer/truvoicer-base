import store from "@/truvoicer-base/redux/store";
import {isSet, isEmpty, isNotEmpty, isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import {tagManagerSendDataLayer} from "@/truvoicer-base/library/api/global-scripts";
import {sprintf} from "sprintf-js";
import {ItemRoutes} from "@/config/item-routes";
import {getPostItemUrl} from "@/truvoicer-base/library/helpers/posts";
import {
    DISPLAY_AS_COMPARISONS,
    DISPLAY_AS_LIST,
    DISPLAY_AS_POST_LIST, DISPLAY_AS_SIDEBAR_LIST, DISPLAY_AS_SIDEBAR_POST,
    DISPLAY_AS_TILES
} from "@/truvoicer-base/redux/constants/general_constants";
import {PostRoutes} from "@/config/post-routes";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/wp-helpers";
import Image from 'next/image';
import {EngineBase} from "@/truvoicer-base/library/listings/engine/engine-base";
import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";
import {StateHelpers} from "@/truvoicer-base/library/helpers/state-helpers";

export class ListingsEngine extends EngineBase {
    constructor(context) {
        super();
        this.setListingsContext(context);
    }

    setListingsContext(context) {
        this.listingsContext = context;
    }


    getInitData() {
        return this.listingsContext;
    }

    updateContext({key, value}) {
        switch (this.dataStore) {
            case ListingsManagerBase.DATA_STORE_CONTEXT:
                this.listingsContext.updateData({key, value})
                break;
            case ListingsManagerBase.DATA_STORE_STATE:
                StateHelpers.updateStateObject({
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ListingsManagerBase.DATA_STORE_VAR:
                this.listingsContext[key] = value;
                break;
        }

    }
    updateContextNestedObjectData({object, key, value}) {
        switch (this.dataStore) {
            case ListingsManagerBase.DATA_STORE_CONTEXT:
                this.listingsContext.updateNestedObjectData({object, key, value});
                break;
            case ListingsManagerBase.DATA_STORE_STATE:
                StateHelpers.updateStateNestedObjectData({
                    object,
                    key,
                    value,
                    setStateObj: this.setState
                })
                break;
            case ListingsManagerBase.DATA_STORE_VAR:
                // this.listingsContext[object][key] = value;
                break;
        }
    }

    addError(error) {
        this.updateContext({key: "error", value: error})
    }

    setListingsScrollTopAction(show) {
        this.updateContext({key: "listingsScrollTop", value: show})
    }


    globalItemLinkClick(trackData = {}) {
        tagManagerSendDataLayer(trackData)
    }

    extractItemId(item) {
        let itemId;
        if (Array.isArray(item?.item_id)) {
            const filterItemId = item?.item_id.filter((id) => id?.data).map((id) => id?.data);
            if (filterItemId.length === 0) {
                return null;
            }
            itemId = filterItemId[0];
        } else {
            itemId = item?.item_id;
        }
        return itemId;
    }
    filterRequestItemsByType(type, item, requestResponseKeys) {
        if (!isObject(item)) {
            return null;
        }
        let cloneItem = {};
       Object.keys(item).forEach((key) => {
            if (!Array.isArray(item[key])) {
                return;
            }
            cloneItem[key] = item[key].filter((requestItem) => {
                const isValid = (
                    isNotEmpty(requestItem?.request_item?.provider_name) &&
                    requestItem?.request_item?.request_type === type &&
                    requestItem?.request_item?.request_name
                );
                if (!isValid) {
                    return false;
                }
                if (Array.isArray(requestResponseKeys) && requestResponseKeys.length === 0) {
                    return true;
                }
                const srResponseKeys = requestItem?.request_item?.request_response_keys;
                if (!Array.isArray(srResponseKeys)) {
                    return false;
                }
                return srResponseKeys.some((srResponseKey) => {
                    return requestResponseKeys.includes(srResponseKey);
                });
            });
        });
        return cloneItem;
    }
    getFirstResponseKeySr(item) {
        if (!isObject(item)) {
            return null;
        }
        let cloneItem = {};
       Object.keys(item).forEach((key) => {
           if (!isObjectEmpty(cloneItem)) {
               return;
           }
            if (!Array.isArray(item[key])) {
                return;
            }
            cloneItem = item[key][0];
        });
        return cloneItem;
    }
    extractServiceRequest({type = null, item = {}, requestResponseKeys = []}) {
        const filterDetailRequestItems = this.filterRequestItemsByType(type, item, requestResponseKeys);
        if (!isObjectEmpty(filterDetailRequestItems) && Object.keys(filterDetailRequestItems).length > 1) {
            console.warn("More than one key in item", item);
        }
        return this.getFirstResponseKeySr(filterDetailRequestItems);
    }

    buildInternalItemViewUrl({item, category}) {
        if (!isNotEmpty(item)) {
            return null;
        }
        let data = {
            service: category
        }
        if (isNotEmpty(item?.post_name)) {
            data.item_id = item.post_name;
        } else if (isNotEmpty(item?.item_id)) {
            data.item_id = item.item_id;
        } else {
            return null;
        }
        return sprintf(ItemRoutes.internalItemView, data);
    }

    getExternalItemViewUrl({item, category, displayAs}) {
        if (!isNotEmpty(item)) {
            console.warn("Can't build item href | No item data");
            return null;
        }

        let serviceRequest = this.extractServiceRequest({
            type: 'detail',
            item,
            requestResponseKeys: ['item_id']
        });
        if (!isNotEmpty(serviceRequest?.data) || isObject(serviceRequest.data) || Array.isArray(serviceRequest.data)) {
            console.warn("Can't build item href | No item item_id");
            return null;
        }
        if (!isNotEmpty(serviceRequest?.request_item?.request_type)) {
            console.warn("Can't build item href | No request type");
            return null;
        }
        if (!isNotEmpty(serviceRequest?.request_item?.provider_name)) {
            console.warn("Can't build item href | No provider name");
            return null;
        }
        let data = {
            service: category,
            service_request: serviceRequest.request_item.request_type,
            item_id: serviceRequest.data,
            provider: serviceRequest.request_item.provider_name
        }

        switch (displayAs) {
            case DISPLAY_AS_POST_LIST:
            case DISPLAY_AS_SIDEBAR_POST:
                return this.getExternalPostUrl(data);
            case DISPLAY_AS_SIDEBAR_LIST:
            case DISPLAY_AS_LIST:
            case DISPLAY_AS_TILES:
                return this.getExternalItemViewUrlByFetchType(data);
            default:
                console.warn("Can't build item href | No displayAs data");
                return null;
        }
    }

    getExternalPostUrl(data) {
        return sprintf( PostRoutes.externalPost, data);
    }

    getExternalItemViewUrlByFetchType(data) {
        let endpoint = null;
        switch (this.listingsContext?.listingsData?.api_fetch_type) {
            case "database":
                endpoint = ItemRoutes.externalItemView;
                break;
            case "api_direct":
                endpoint = ItemRoutes.externalItemViewDirect;
                break;
            default:
                console.warn("Can't build item href | No api_fetch_type data");
                return null;
        }
        return sprintf(endpoint, data);
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
        return <img  src={this.convertLinkToHttps(url)} alt={label}/>
    }

    getItemLink(url, label) {
        return <a href={url}>{label}</a>
    }

    getItemDate(dateString) {
        return <div>{formatDate(dateString)}</div>
    }

    getItemText(text) {
        return <div>{parse(text)}</div>
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
    showSidebar() {
        return (this.listingsContext?.listingsData?.show_filters === true);
    }
    isPrimaryListing() {
        return this.listingsContext?.listingsData?.primary_listing === true;
    }
    globalItemLinkClick(trackData = {}) {
        tagManagerSendDataLayer(trackData)
    }
    getInternalItemUrl({item, category, displayAs}) {
        switch (displayAs) {
            case DISPLAY_AS_POST_LIST:
            case DISPLAY_AS_SIDEBAR_POST:
                return getPostItemUrl({
                    post_name: item?.post_name,
                    category_name: category
                });
            case DISPLAY_AS_LIST:
            case DISPLAY_AS_SIDEBAR_LIST:
            case DISPLAY_AS_TILES:
            case DISPLAY_AS_COMPARISONS:
                return this.buildInternalItemViewUrl({item, category})
            default:
                return null;
        }
    }
    getItemLinkProps({source, category, item, displayAs, trackData = {}, onClick = () => {}}) {
        let props = {
            href: '#'
        };
        switch (source) {
            case "internal":
            case "wordpress":
                props.href = this.getInternalItemUrl({category, item, displayAs})
                break;
            default:
                props.href = this.getExternalItemViewUrl({item, category, displayAs});
                break;
        }
        props.onClick = (e) => {
            this.globalItemLinkClick(trackData);
            if (typeof onClick === "function") {
                onClick(e);
            }
        };
        if (typeof props?.href !== 'string') {
            props.href = '#';
        }
        return props;
    }
    getListingsItemLinkProps({category, item, displayAs, trackData = {}}) {
        const listingsData = this.listingsContext?.listingsData;

        return this.getItemLinkProps({
           category,
           item,
            source: listingsData?.source,
            displayAs,
            trackData,
            onClick: (e) => {
                if (isSet(listingsData?.item_view_display) && listingsData.item_view_display === "page") {
                    // e.preventDefault()
                }
                this.updateContext({key: "query", value: {}})
            }
        });
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
                    if (!isObject(item?.single_item_id?.single_item?.data_keys)) {
                        return;
                    }
                    listData.push(this.buildDataKeyObject(
                        item?.single_item_id?.single_item.data_keys,
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


    static getCustomItemsData(listPositions = [], listingsData = null) {
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
                listPosData = [];
            }
            listData = [...listData, ...listPosData];
        })
        return listData;
    }

}
