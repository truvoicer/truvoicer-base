import React, {useContext} from 'react';
import {listingsGridConfig} from "@/config/listings-grid-config";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import LoaderComponent from "../loaders/Loader";
import {connect} from "react-redux";
import Head from "next/head";
import {getItemViewPageTitle} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {DISPLAY_AS_POST_LIST} from "@/truvoicer-base/redux/constants/general_constants";

const ItemViewBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getItemView = (item) => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[DISPLAY_AS_POST_LIST])) {
            return null;
        }
        if (!isSet(gridConfig[DISPLAY_AS_POST_LIST].single)) {
            return null;
        }
        const ItemView = gridConfig[DISPLAY_AS_POST_LIST].single;
        return <ItemView item={item} data={props.data} category={props.item.category}/>
    }
    //console.log({props})
    function defaultView() {
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
}

ItemViewBlock.category = 'public';
ItemViewBlock.templateId = 'itemViewBlock';
function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        item: state.item,
    };
}

export default connect(
    mapStateToProps,
    null
)(ItemViewBlock);
