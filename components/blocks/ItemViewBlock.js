import React, {useContext} from 'react';
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import LoaderComponent from "../loaders/Loader";
import {connect} from "react-redux";
import Head from "next/head";
import {getItemViewPageTitle} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {DISPLAY_AS_LIST, DISPLAY_AS_POST_LIST} from "@/truvoicer-base/redux/constants/general_constants";
import DefaultItemView from "@/truvoicer-base/components/blocks/listings/items/Default/DefaultItemView";

const ItemViewBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getItemView = (item) => {
        return templateManager.render(
            <DefaultItemView type={props?.item?.type} item={item} data={props.data} category={props.item.category} postNav={props.postNavData}/>
        );
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
