
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {isObject} from "@/truvoicer-base/library/utils";
import {StateHelpers} from "@/truvoicer-base/library/helpers/state-helpers";
import {WpDataSource} from "@/truvoicer-base/library/listings/engine/source/wp-data-source";
import {FetcherDataSource} from "@/truvoicer-base/library/listings/engine/source/fetcher-data-source";

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
        this.listingsEngine = null;
        this.searchEngine = null;
        this.initListingsEngine(listingsContext);
        this.initSearchEngine(searchContext);
        this.initDataSources();
    }
    initDataSources() {
        this.wpDataSource = new WpDataSource(this.listingsEngine, this.searchEngine);
        this.fetcherDataSource = new FetcherDataSource(this.listingsEngine, this.searchEngine);
    }
    initListingsEngine(listingsContext) {
        if (!listingsContext) {
            return;
        }
        this.listingsEngine = new ListingsEngine(listingsContext);
        this.listingsEngine.setDataStore(this.dataStore);
        this.initDataSources();
    }
    initSearchEngine(searchContext) {
        if (!searchContext) {
            return;
        }
        this.searchEngine = new SearchEngine(searchContext);
        this.searchEngine.setDataStore(this.dataStore);
        this.initDataSources();
    }

    setListingsContext(listingsContext) {
        if (!this.listingsEngine) {
            this.initListingsEngine(listingsContext);
        }
        this.listingsEngine.setListingsContext(StateHelpers.getStateData(listingsContext));
        this.listingsEngine.setSetState(StateHelpers.getSetStateData(listingsContext));
    }
    setSearchContext(searchContext) {
        if (!this.searchEngine) {
            this.initSearchEngine(searchContext);
        }
        this.searchEngine.setSearchContext(StateHelpers.getStateData(searchContext));
        this.searchEngine.setSetState(StateHelpers.getSetStateData(searchContext));
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
        this.initDataSources();
    }
}
