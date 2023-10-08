import {isObject} from "@/truvoicer-base/library/utils";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";

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

