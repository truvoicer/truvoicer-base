import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {setListingsBlocksDataAction} from "../../../redux/actions/page-actions";
import {scrollToRef} from "../../../library/utils";

const ListingsBlockContainer = (props) => {
    useEffect(() => {
        setListingsBlocksDataAction(props.data)
    }, [])
    const myRef = useRef(null)
    if (props.listings.listingsScrollTop) {
        scrollToRef(myRef)
    }
    return (
        <div ref={myRef}>
            {props.children}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        listings: state.listings,
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockContainer);