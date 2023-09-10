
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import {ItemEngine} from "@/truvoicer-base/library/listings/engine/item-engine";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";

export class ListingsEngineBase {
    constructor(listingsContext, searchContext, itemsContext) {
        this.listingsEngine = new ListingsEngine(listingsContext);
        this.searchEngine = new SearchEngine(searchContext);
        this.itemsEngine = new ItemEngine(itemsContext);
        // this.setSearchContext(searchContext);
        // this.setItemsContext(itemsContext);
        // this.setListingsContext(listingsContext);
    }

    setListingsContext(context) {
        this.listingsEngine.setListingsContext(context);
    }
    setSearchContext(context) {
        this.searchEngine.setSearchContext(context);
    }
    setItemsContext(context) {
        this.itemsEngine.setItemContext(context);
    }

    getListingsEngine() {
        return this.listingsEngine;
    }
    getSearchEngine() {
        return this.searchEngine;
    }
    getItemEngine() {
        return this.itemsEngine;
    }
}
