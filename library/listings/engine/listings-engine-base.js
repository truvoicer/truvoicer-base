
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";

export class ListingsEngineBase {
    constructor(listingsContext, searchContext) {
        this.listingsEngine = new ListingsEngine(listingsContext);
        this.searchEngine = new SearchEngine(searchContext);
    }

    getListingsEngine() {
        return this.listingsEngine;
    }
    getSearchEngine() {
        return this.searchEngine;
    }
}
