import {ListingsManagerBase} from "@/truvoicer-base/library/listings/listings-manager-base";

export class EngineBase {

    dataStore = ListingsManagerBase.DATA_STORE_CONTEXT;
    setState = null;

    setDataStore(dataStore) {
        if (ListingsManagerBase.DATA_STORES.indexOf(dataStore) === -1) {
            throw new Error(`Invalid data store: ${dataStore}`);
        }
        this.dataStore = dataStore;
    }

    setSetState(setState) {
        this.setState = setState;
    }
}
