
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {isObject} from "@/truvoicer-base/library/utils";

export class ListingsManagerBase {
    static DATA_STORE_CONTEXT = 'context';
    static DATA_STORE_STATE = 'state';
    static DATA_STORE_VAR = 'var';
    static DATA_STORES = [
        ListingsManagerBase.DATA_STORE_CONTEXT,
        ListingsManagerBase.DATA_STORE_STATE,
        ListingsManagerBase.DATA_STORE_VAR
    ];

    dataStore = ListingsManagerBase.DATA_STORE_CONTEXT;

    constructor(listingsContext, searchContext) {
        if (isObject(listingsContext)) {
            this.listingsEngine = new ListingsEngine(listingsContext);
            this.listingsEngine.setDataStore(this.dataStore);
        }
        if (isObject(searchContext)) {
            this.searchEngine = new SearchEngine(searchContext);
            this.searchEngine.setDataStore(this.dataStore);
        }
    }

    getListingsEngine() {
        return this.listingsEngine;
    }
    getSearchEngine() {
        return this.searchEngine;
    }

    setDataStore(dataStore) {
        if (ListingsManagerBase.DATA_STORES.indexOf(dataStore) === -1) {
            throw new Error(`Invalid data store: ${dataStore}`);
        }
        this.dataStore = dataStore;
        this.listingsEngine.setDataStore(this.dataStore);
        this.searchEngine.setDataStore(this.dataStore);
    }
}
