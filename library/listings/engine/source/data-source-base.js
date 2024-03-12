import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";

export class DataSourceBase {

    constructor(listingsEngine, searchEngine) {
        this.listingsEngine = listingsEngine;
        this.searchEngine = searchEngine;
    }

    getListingsEngine() {
        return this.listingsEngine;
    }
    getSearchEngine() {
        return this.searchEngine;
    }
}
