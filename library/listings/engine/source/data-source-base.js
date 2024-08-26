import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {SearchEngine} from "@/truvoicer-base/library/listings/engine/search-engine";
import store from "@/truvoicer-base/redux/store";
import {SESSION_AUTHENTICATED, SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "@/truvoicer-base/library/api/wp/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";

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

    getListingsDataForInternalUserItemDataRequest() {

        const listingsData = this.listingsEngine?.listingsContext?.listingsData;
        let providers = [];
        let listPositions = [];
        if (listingsData?.list_start) {
            listPositions.push('list_start');
            if (!providers.find((provider) => provider.provider_name === "internal")) {
                providers.push({
                    provider_name: "internal",
                    ids: []
                });
            }
        }
        if (listingsData?.list_end) {
            listPositions.push('list_end');
            if (!providers.find((provider) => provider.provider_name === "internal")) {
                providers.push({
                    provider_name: "internal",
                    ids: []
                });
            }
        }
        if (listingsData?.custom_position) {
            listPositions.push('custom_position');
            if (!providers.find((provider) => provider.provider_name === "internal")) {
                providers.push({
                    provider_name: "internal",
                    ids: []
                });
            }
        }
        return {
            providers,
            listPositions
        };
    }
    async getUserItemDataRequest(providers) {
        if (!Array.isArray(providers) || providers.length === 0) {
            return false;
        }
        const session = {...store.getState().session};

        if (!session[SESSION_AUTHENTICATED]) {
            return;
        }
        const userId = session[SESSION_USER][SESSION_USER_ID]


        const requestData = {
            providers,
            user_id: userId
        }
        console.log('requestData', requestData)
        const response = await wpResourceRequest({
            endpoint: wpApiConfig.endpoints.savedItemsList,
            data: requestData,
            method: REQUEST_POST,
            protectedReq: true
        })
        return await response.json();

    }

    userItemsDataListResponseHandler(responseData) {
        console.log('response', responseData)
        this.searchEngine.setSavedItemsListAction(responseData?.savedItems || []);
        this.searchEngine.setItemRatingsListAction(responseData?.itemRatings || []);
    }
}
