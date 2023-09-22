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
