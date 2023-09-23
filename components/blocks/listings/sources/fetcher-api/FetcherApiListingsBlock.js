import React from 'react';
import FeedsListingsBlock from "./types/FeedsListingsBlock";
import SearchListingsBlock from "./types/SearchListingsBlock";
import ListingsBlockContainer
    from "../../ListingsBlockContainer";

const FetcherApiListingsBlock = (props) => {
    const getListingsBlock = (listingBlockType) => {
        switch (listingBlockType) {
            case "blog":
                return <FeedsListingsBlock data={props.data}/>
            case "search":
            default:
                return <SearchListingsBlock data={props.data}/>
        }
    }
    return (
        <ListingsBlockContainer data={props.data}>
            {getListingsBlock(props.data?.listing_block_type)}
        </ListingsBlockContainer>
    )
};

export default FetcherApiListingsBlock;
