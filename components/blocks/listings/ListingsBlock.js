import React from "react";
import {connect} from "react-redux";
import SearchListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Types/SearchListingsBlock";
import ListingsBlockContainer from "./ListingsBlockContainer";
import FeedsListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Types/FeedsListingsBlock";

const ListingsBlock = (props) => {
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
            {getListingsBlock(props.listings?.listingsData?.listing_block_type)}
        </ListingsBlockContainer>
    )
}

function mapStateToProps(state) {
    return {
        listings: state.listings
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlock);