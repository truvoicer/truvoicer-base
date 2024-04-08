import React, {useContext} from "react";
import {formatDate, isNotEmpty} from "@/truvoicer-base/library/utils";
import {SESSION_USER, SESSION_USER_EMAIL, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import parse from 'html-react-parser';
import BlogCategoryList from "@/truvoicer-base/components/widgets/BlogCategoryList";
import Link from "next/link";
import {getPostItemUrl} from "@/truvoicer-base/library/helpers/posts";
import {
    setNextPostNavDataAction, setPostNavFromListAction, setPostNavIndexAction,
    setPrevPostNavDataAction
} from "@/truvoicer-base/redux/actions/page-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Image from "next/image";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";

const PostItemListPost = (props) => {
    const {data, nextPost, prevPost, postIndex} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    function getCategory() {
        if (Array.isArray(data?.categories) && data?.categories?.length > 0) {
            return data.categories[0]
        }
        return null
    }

    const category = getCategory();
    const linkProps = listingsManager.getListingsEngine().getListingsItemLinkProps({
        displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
        category: category?.slug,
        item: props.data,
    })
    // console.log({linkProps})

    return (
            <div className="post-block-style post-grid clearfix">
                {isNotEmpty(data?.featured_image) &&
                <div className="post-thumb">
                    <Link {...linkProps}>
                        <img
                            className="img-fluid"
                            src={data?.featured_image ? data.featured_image : ""}
                            alt=""
                        />
                    </Link>
                </div>
                }
                {isNotEmpty(category) &&
                <Link className="post-cat" {...linkProps}>{category?.slug || ''}</Link>
                }
                {Array.isArray(data?.categories) &&
                    <BlogCategoryList
                        categories={data?.categories}
                        classes={"blog-info-link"}
                    />
                }
                <div className="post-content">
                    <h2 className="post-title title-large">
                        <Link {...linkProps}>{data.post_title}</Link>
                    </h2>
                    <div className="post-meta">
                        <span className="post-author"><a href="#">John Doe</a></span>
                        <span className="post-date">{formatDate(data.post_modified)}</span>
                        <span className="post-comment pull-right"><i className="fa fa-comments-o"></i>
                            <a href="#" className="comments-link"><span>03</span></a></span>
                    </div>
                    <p>{parse(data.post_excerpt)}</p>
                </div>
            </div>
    );

}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(PostItemListPost);
