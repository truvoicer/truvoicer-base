import {isNotEmpty, isObject, isObjectEmpty} from "@/truvoicer-base/library/utils";
import {siteConfig} from "@/config/site-config";

export function buildFilterList(data) {
    if (typeof data !== 'object') {
        return [];
    }
    const filterListObject = data?.filter_lists;
    if (typeof filterListObject !== 'object') {
        return [];
    }
    const filterList = filterListObject?.list_items;
    if (!Array.isArray(filterList)) {
        return [];
    }
    return filterList;
}

export const buildDataKeyObject = (dataKeyList, itemId, itemSlug = null) => {
    let cloneDataKeyList = {...dataKeyList};
    let dataKeyObject = convertDataKeysDataArray(cloneDataKeyList);
    return renderDataKeyObject(dataKeyObject, itemId, itemSlug);
}
export const renderDataKeyObject = (dataKeyObject = {}, itemId, itemSlug = null) => {
    dataKeyObject.item_id = itemId;
    if (isNotEmpty(itemSlug)) {
        dataKeyObject.item_slug = itemSlug;
    }
    dataKeyObject.provider = siteConfig.internalProviderName;
    dataKeyObject.category = siteConfig.internalCategory;
    dataKeyObject.custom_item = true;
    return dataKeyObject;
}
export const convertDataKeysDataArray = (dataKeyList) => {
    let dataKeyObject = {};
    // dataKeyList.map((item) => {
    //     dataKeyObject[item.data_item_key] = getDataKeyValue(item)
    // })
    return dataKeyList;
}

export function extractItemListFromPost({post}) {
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
                if (!item?.single_item_id?.single_item?.data_keys) {
                    return;
                }
                if (!isObject(item?.single_item_id?.single_item?.data_keys)) {
                    return;
                }
                listData.push(buildDataKeyObject(
                    item?.single_item_id?.single_item.data_keys,
                    item?.single_item_id?.ID,
                    item?.single_item_id?.post_name
                ));
                break;
            case "custom":
                listData.push(item);
                break;
        }
    });
    return listData;
}

export function buildCarouselData(data) {
    let dataClone = {...data};
    if (!isObject(dataClone?.item_list_id)) {
        return null;
    }
    dataClone.item_list =  extractItemListFromPost({
        post: dataClone.item_list_id
    })
    return dataClone;
}

export function extractCategoryIds(categories) {
    if (!Array.isArray(categories)) {
        return [];
    }
    return categories.map(category => {
        if (!isObject(category)) {
            return null;
        }
        return category?.term_id || category?.id || category?.ID || null;
    }).filter(categoryId => categoryId !== null);
}

export function mapDataToKeymap({keymap, item}) {
    if (isObjectEmpty(keymap)) {
        return item;
    }
    const data = {};
    Object.keys(keymap).forEach((key) => {
        const mapKey = keymap?.[key];
        data[key] = item?.[mapKey];
    });
    return {...item, ...data};
}
