import React, {useContext} from 'react';
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

const ItemViewBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsGrid = new ListingsGrid();

    const getItemView = (item) => {
        if (!isNotEmpty(props?.item?.[DISPLAY_AS])) {
            return false;
        }
        if (!isNotEmpty(item?.service?.name)) {
            return false;
        }
        const layoutComponent =  listingsGrid.getTemplateListingComponent({
            displayAs: props.item[DISPLAY_AS],
            category: item?.service?.name,
            component: 'itemView',
            props: {
                type: props?.item?.type,
                item: item,
                data: props.data,
                category: props.item.category,
                postNav: props.postNavData,
            }
        });

        if (!layoutComponent) {
            console.warn(`No itemView component found for display as: ${props.item[DISPLAY_AS]} | category: ${item?.service?.name}`);
            return null
        }
        console.log('itemviewblock', layoutComponent)
        // return layoutCompoent;
        return layoutComponent;
    }
    //console.log({props})
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
    };
}

export default connect(
    mapStateToProps,
    null
)(ItemViewBlock);
