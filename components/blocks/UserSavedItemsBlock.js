import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {isNotEmpty, isObjectEmpty, isSet, uCaseFirst} from "../../library/utils";
import {siteConfig} from "@/config/site-config";
import {buildDataKeyObject} from "../../library/helpers/items";
import {SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import SavedItemsVerticalTabs from "../tabs/SavedItemsVerticalTabs";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

function UserSavedItemsBlock(props) {
    const [tabData, setTabData] = useState({});
    const searchContext = useContext(SearchContext);
    const listingsContext = useContext(ListingsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const buildSavedItemsList = (data) => {
        let tabDataObject = {};
        data.map((savedItem) => {
            if (!isSet(tabDataObject[savedItem.provider_name])) {
                tabDataObject[savedItem.provider_name] = {}
                tabDataObject[savedItem.provider_name].items = [];
            }
            tabDataObject[savedItem.provider_name].category = savedItem.category;
            tabDataObject[savedItem.provider_name].name = savedItem.provider_name;
            tabDataObject[savedItem.provider_name].label = uCaseFirst(savedItem.provider_name);
            tabDataObject[savedItem.provider_name].items.push(savedItem);
            if (!Array.isArray(tabDataObject[savedItem.provider_name].items_response)) {
                tabDataObject[savedItem.provider_name].items_response = [];
            }
            const internalItemsData = getInternalItemsData(savedItem);
            if (internalItemsData) {
                tabDataObject[savedItem.provider_name].items_response.push(internalItemsData)
            }

        })
        return tabDataObject;
    }

    const getInternalItemsData = (item) => {
        if (item?.provider_name !== siteConfig.internalProviderName) {
            return false;
        }
        if (Array.isArray(item?.data?.api_data_keys_list) &&
            item.data.api_data_keys_list.length > 0
        ) {
            return buildDataKeyObject(
                item.data.api_data_keys_list,
                parseInt(item.item_id)
            );
        }
        return false;
    }

    useEffect(() => {
        setTabData(tabData => {
            return buildSavedItemsList(searchContext?.savedItemsList);
        });
    }, [searchContext?.savedItemsList])

    useEffect(() => {
        let isCancelled = false;
        if (!isNotEmpty(props.session[SESSION_USER][SESSION_USER_ID])) {
            return;
        }
        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsListByUser),
            {"user_id": props.session[SESSION_USER][SESSION_USER_ID]}
        )
            .then((response) => {
                if (!isCancelled) {
                    listingsManager.searchEngine.setSearchRequestOperationAction(NEW_SEARCH_REQUEST);
                    listingsManager.searchEngine.setSavedItemsListAction(response.data.data)
                }
            })
            .catch(error => {
                console.error(error);
            })
        return () => {
            isCancelled = true;
        }
    }, [props.session[SESSION_USER][SESSION_USER_ID]])

    return (
            <div className="job_listing_area pt-5">
                <div className={"listings-block job_lists mt-0"}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-12 mb-5" data-aos="fade">
                                <h2>My Saved Items</h2>
                                {!isObjectEmpty(tabData) &&
                                <SavedItemsVerticalTabs data={tabData}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
function mapStateToProps(state) {
    // console.log(state.page)
    return {
        session: state.session,
    };
}

export default connect(
    mapStateToProps,
    null
)(UserSavedItemsBlock);
