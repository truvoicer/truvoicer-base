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

function UserSavedItemsBlock({session, data, ...otherProps}) {

    const [tabData, setTabData] = useState({});
    const searchContext = useContext(SearchContext);
    const listingsContext = useContext(ListingsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    console.log('UserSavedItemsBlock', data);

    async function getUserSavedItems(isCancelled = false) {
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.savedItemsListByUser),
            {"user_id": session[SESSION_USER][SESSION_USER_ID]}
        )
        if (!isCancelled) {
            listingsManager.searchEngine.setSearchRequestOperationAction(SEARCH_REQUEST_NEW);
            listingsManager.searchEngine.setSavedItemsListAction(response.data)
        }
    }


    useEffect(() => {
        let isCancelled = false;
        if (!isNotEmpty(session[SESSION_USER][SESSION_USER_ID])) {
            return;
        }
        getUserSavedItems(isCancelled);
        return () => {
            isCancelled = true;
        }
    }, [session[SESSION_USER][SESSION_USER_ID]])
    return (
        <div className="job_listing_area pt-5">
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
