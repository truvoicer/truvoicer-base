import React, {useContext} from 'react';
import {listingsGridConfig} from "@/config/listings-grid-config";
import {isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import LoaderComponent from "../loaders/Loader";
import {connect} from "react-redux";
import Head from "next/head";
import {getItemViewPageTitle} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ItemViewBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getItemView = (item) => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[props.item.category])) {
            return null;
        }
        if (!isSet(gridConfig[props.item.category].single)) {
            return null;
        }
        const ItemView = gridConfig[props.item.category].single;
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
                    <LoaderComponent/>
                }
            </>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'itemViewBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getItemView: getItemView,
            ...props
        }
    })
}

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
