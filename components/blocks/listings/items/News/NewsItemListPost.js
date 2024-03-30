import React, {useContext} from "react";
import {formatDate} from "@/truvoicer-base/library/utils";
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

const NewsItemListPost = (props) => {
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
    const linkProps = listingsManager.getListingsEngine().getItemLinkProps({
        displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
        category: category?.slug,
        item: props.data,
    })
    // console.log({linkProps})

    return (
        <article className="blog_item">
            <div className="blog_item_img">
                <div className="blog_item_img_inner">
                    <img
                        className="card-img rounded-0"
                        src={data?.featured_image ? data.featured_image : ""}
                        alt=""
                    />
                </div>
                <a className={"blog_item_date"}>
                    <h3>{formatDate(data.post_modified, "D")}</h3>
                    <p>{formatDate(data.post_modified, "MMM")}</p>
                </a>
            </div>

            <div className="blog_details">
                {linkProps.href
                    ?
                    <Link
                        className="d-inline-block"
                        {...linkProps}
                        onClick={() => {
                            setPostNavFromListAction(true)
                            setPostNavIndexAction(postIndex)
                            setNextPostNavDataAction(nextPost)
                            setPrevPostNavDataAction(prevPost)
                        }}
                    >
                        <h2>{data.post_title}</h2>
                    </Link>
                    :
                    <h2>{data.post_title}</h2>
                }
                <p>
                    {parse(data.post_excerpt)}
                </p>

                <BlogCategoryList
                    categories={data?.categories}
                    classes={"blog-info-link"}
                />
            </div>
        </article>
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
)(NewsItemListPost);
