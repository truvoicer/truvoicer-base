import React, {useContext} from "react";
import ListingsBlockContainer
    from "@/truvoicer-base/components/blocks/listings/ListingsBlockContainer";
import RecruitmentListingsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/categories/Recruitment/RecruitmentListingsBlock";
import LoaderComponent from "@/truvoicer-base/components/widgets/Loader";
import ComparisonsListingsBlock from "@/truvoicer-base/components/blocks/listings/sources/wp/posts/categories/Comparisons/ComparisonsListingsBlock";
import {siteConfig} from "@/config/site-config";
import {connect} from "react-redux";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const PostsListingsBlock = (props) => {
    const {data} = props;
    const listingsContext = useContext(ListingsContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
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
    function defaultView() {
        return (
            <ListingsBlockContainer data={data}>
                {getListingsBlock()}
            </ListingsBlockContainer>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'post_listings',
        templateId: 'postsListingsBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getListingsBlock: getListingsBlock,
            ...props
        }
    });
}


function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(PostsListingsBlock);
