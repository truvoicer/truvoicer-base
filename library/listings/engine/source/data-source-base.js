import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import store from "@/truvoicer-base/redux/store";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";

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


    async getUserItemsListAction(data, provider, category) {
        if (!Array.isArray(data) || data.length === 0) {
            return false;
        }
        const session = {...store.getState().session};

        if (!session[SESSION_AUTHENTICATED]) {
            return;
        }
        const userId = session[SESSION_USER][SESSION_USER_ID]

        const listingsData = this.listingsEngine?.listingsContext?.listingsData;

        let providers = [provider];
        let listPositions = [];
        if (listingsData?.list_start) {
            listPositions.push('list_start');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }
        if (listingsData?.list_end) {
            listPositions.push('list_end');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }
        if (listingsData?.custom_position) {
            listPositions.push('custom_position');
            if (providers.indexOf("internal") === -1) {
                providers.push("internal");
            }
        }

        const itemsList = data.map((item) => {
            return this.listingsEngine.extractItemId(item);
        })
        const wpListIds = ListingsEngine.getCustomItemsData(listPositions).map((item) => {
            return this.listingsEngine.extractItemId(item);
        })

        const requestData = {
            provider_name: providers,
            category: category,
            id_list: [...wpListIds, ...itemsList],
            user_id: userId
        }

        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsList),
            requestData,
        )

        this.searchEngine.setSavedItemsListAction(response?.savedItems || []);
        this.searchEngine.setItemRatingsListAction(response?.itemRatings || []);
    }

    getUserItemsListCallback(error, data) {
        if (error) {
            return false;
        }
    }
}
