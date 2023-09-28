import React, {useContext} from 'react';
import FeedsListingsBlock from "./types/FeedsListingsBlock";
import SearchListingsBlock from "./types/SearchListingsBlock";
import ListingsBlockContainer
    from "../../ListingsBlockContainer";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const FetcherApiListingsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getListingsBlock = (listingBlockType) => {
        switch (listingBlockType) {
            case "blog":
                return <FeedsListingsBlock data={props.data}/>
            case "search":
            default:
                return <SearchListingsBlock data={props.data}/>
        }
    }
    function defaultView() {
    return (
        <ListingsBlockContainer data={props.data}>
            {getListingsBlock(props.data?.listing_block_type)}
        </ListingsBlockContainer>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'l',
        templateId: 'fetcherApiListingsBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getListingsBlock: getListingsBlock
        }
    })
};

export default FetcherApiListingsBlock;
