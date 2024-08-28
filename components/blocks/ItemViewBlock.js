import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import LoaderComponent from "../loaders/Loader";
import {connect} from "react-redux";
import Head from "next/head";
import {getItemViewPageTitle} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {DISPLAY_AS, DISPLAY_AS_LIST, DISPLAY_AS_POST_LIST} from "@/truvoicer-base/redux/constants/general_constants";
import DefaultItemView from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemView";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING} from "@/truvoicer-base/redux/constants/session-constants";

const ItemViewBlock = (props) => {
    const {session} = props;
    const [userItemData, setUserItemData] = useState({
        is_saved: false,
        rating: {},
    });


    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsGrid = new ListingsGrid();
    const listingsManager = new ListingsManager({}, {});

    function validate(item) {
        switch (props.item.type) {
            case 'internal':
                if (!isNotEmpty(props?.item?.category)) {
                    return false;
                }
                break;
            case 'external':
                if (!isNotEmpty(item?.service?.name)) {
                    return false;
                }
                break;
            default:
                return false;
        }
        return true;
    }

    function getService(item) {
        switch (props.item.type) {
            case 'internal':
                return props?.item?.category;
            case 'external':
                return item?.service?.name;
            default:
                return null;
        }
    }

    async function itemUserDataRequest() {
        const responseData = await listingsManager.itemUserDataRequest(
            listingsManager.getSourceByType(props.item.type),
            [props.item.data]
        )
        let userData = {};
        if (Array.isArray(responseData?.savedItems) && responseData?.savedItems.length > 0) {
            const findSavedItem = responseData.savedItems.find((savedItem) => {
                return (
                    isNotEmpty(savedItem?.item_id) &&
                    isNotEmpty(props.item.data?.item_id) &&
                    savedItem.item_id == props.item.data.item_id
                );
            })
            if (findSavedItem) {
                userData.is_saved = true;
            }
        }
        if (Array.isArray(responseData?.itemRatings) && responseData?.itemRatings.length > 0) {
            const findRating = responseData.itemRatings.find((savedItem) => {
                return (
                    isNotEmpty(savedItem?.item_id) &&
                    isNotEmpty(props.item.data?.item_id) &&
                    savedItem.item_id == props.item.data.item_id
                );
            })

            if (findRating) {
                userData.rating = findRating;
            }
        }
        console.log(userData);
        setUserItemData(userData);
    }

    const getItemView = (item) => {
        if (!isNotEmpty(props?.item?.[DISPLAY_AS])) {
            console.warn(`ItemViewBlock: Invalid display as`);
            return false;
        }
        if (!validate(item)) {
            console.warn(`ItemViewBlock: Invalid item data`);
            return false;
        }
        const layoutComponent = listingsGrid.getTemplateListingComponent({
            displayAs: props.item[DISPLAY_AS],
            category: getService(item),
            component: 'itemView',
            props: {
                type: props?.item?.type,
                item: item,
                data: props.data,
                category: props.item.category,
                postNav: props.postNavData,
                userItemData: userItemData,
            }
        });

        if (!layoutComponent) {
            console.warn(`No itemView component found for display as: ${props.item[DISPLAY_AS]} | category: ${item?.service?.name}`);
            return null
        }
        return layoutComponent;
    }
    useEffect(() => {

        if (session[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        if (!session[SESSION_AUTHENTICATED]) {
            return;
        }
        itemUserDataRequest();
    }, [session[SESSION_IS_AUTHENTICATING], session[SESSION_AUTHENTICATED]]);

    return (
        <>
            <Head>
                <title>{getItemViewPageTitle()}</title>
            </Head>
            {!isObjectEmpty(props.item.data)
                ?
                <>
                    {getItemView(props.item.data)}
                </>
                :
                templateManager.render(<LoaderComponent/>)
            }
        </>
    );

}

ItemViewBlock.category = 'public';
ItemViewBlock.templateId = 'itemViewBlock';

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        postNavData: state.page.postNavData,
        item: state.item,
        session: state.session,
    };
}

export default connect(
    mapStateToProps,
    null
)(ItemViewBlock);
