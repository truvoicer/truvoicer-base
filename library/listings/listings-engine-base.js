
import {SearchEngine} from "@/truvoicer-base/library/search/search-engine";
import {ItemEngine} from "@/truvoicer-base/library/listings/item-engine";

export class ListingsEngineBase {
    constructor(searchContext, itemsContext) {
        this.searchEngine = new SearchEngine();
        this.itemsEngine = new ItemEngine();
        this.setSearchContext(searchContext);
        this.setItemsContext(itemsContext);
    }

    setSearchContext(context) {
        this.searchEngine.setSearchContext(context);
    }
    setItemsContext(context) {
        this.itemsEngine.setItemContext(context);
    }

    getSearchEngine() {
        return this.searchEngine;
    }
    getItemEngine() {
        return this.itemsEngine;
    }
}
