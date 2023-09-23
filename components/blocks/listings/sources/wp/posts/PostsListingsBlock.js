import React, {useContext} from "react";
import ListingsBlockContainer
    from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import RecruitmentListingsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/categories/Recruitment/RecruitmentListingsBlock";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import ComparisonsListingsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/categories/Comparisons/ComparisonsListingsBlock";
import {siteConfig} from "@/config/site-config";
import {connect} from "react-redux";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";

const PostsListingsBlock = ({data}) => {
    const listingsContext = useContext(ListingsContext);
    const getListingsBlock = () => {
        switch (listingsContext?.listingsData?.listings_category) {
            case siteConfig.internalCategory:
                return <RecruitmentListingsBlock data={data} />
            case "comparisons":
                return <ComparisonsListingsBlock data={data} />
            default:
                return <LoaderComponent />
        }
    }
    return (
        <ListingsBlockContainer data={data}>
            {getListingsBlock()}
        </ListingsBlockContainer>
    )
}


function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(PostsListingsBlock);
