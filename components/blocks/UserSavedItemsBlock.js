import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {isNotEmpty, isObjectEmpty, isSet, uCaseFirst} from "../../library/utils";
import {siteConfig} from "@/config/site-config";
import {SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {SEARCH_REQUEST_NEW} from "../../redux/constants/search-constants";
import SavedItemsVerticalTabs from "../tabs/SavedItemsVerticalTabs";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {buildDataKeyObject} from "@/truvoicer-base/library/helpers/wp-helpers";

function UserSavedItemsBlock(props) {
    const [tabData, setTabData] = useState({});
    const searchContext = useContext(SearchContext);
    const listingsContext = useContext(ListingsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
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
    async function getUserSavedItems(isCancelled = false) {
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsListByUser),
            {"user_id": props.session[SESSION_USER][SESSION_USER_ID]}
        )
        if (!isCancelled) {
            listingsManager.searchEngine.setSearchRequestOperationAction(SEARCH_REQUEST_NEW);
            listingsManager.searchEngine.setSavedItemsListAction(response.data)
        }
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
        getUserSavedItems(isCancelled);
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
                                templateManager.render(<SavedItemsVerticalTabs data={tabData}/>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

UserSavedItemsBlock.category = 'account';
UserSavedItemsBlock.templateId = 'userSavedItemsBlock';

export default connect(
    mapStateToProps,
    null
)(UserSavedItemsBlock);
