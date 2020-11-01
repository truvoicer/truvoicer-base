import React from "react";
import {connect} from "react-redux";
import SearchListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Types/SearchListingsBlock";
import BlogListingsBlock from "../../../../views/Components/Blocks/Listings/ListingsBlock/Types/BlogListingsBlock";
import ListingsBlockContainer from "./ListingsBlockContainer";

const ListingsBlock = (props) => {
    const getListingsBlock = (listingBlockType) => {
        switch (listingBlockType) {
            case "blog":
                return <BlogListingsBlock data={props.data}/>
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