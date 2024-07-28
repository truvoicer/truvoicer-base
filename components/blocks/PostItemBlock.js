import React, {useContext} from 'react';
import {connect} from "react-redux";
import parse from 'html-react-parser';
import BlogCategoryList from "../widgets/BlogCategoryList";
import {formatDate, isNotEmpty, isObjectEmpty, isSet} from "../../library/utils";
import {getNextPostFromList, getPostItemUrl, getPrevPostFromList} from "../../library/helpers/posts";
import Link from "next/link";
import {setPostNavIndexAction} from "../../redux/actions/page-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faBehance, faDribbble, faFacebookF, faTwitter} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import SocialShareWidget from "@/truvoicer-base/components/widgets/SocialShareWidget";
import PostNavigation from "@/truvoicer-base/components/widgets/post/PostNavigation";
import SocialFollowWidget from "@/truvoicer-base/components/widgets/SocialFollowWidget";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {DISPLAY_AS_LIST} from "@/truvoicer-base/redux/constants/general_constants";

const PostItemBlock = (props) => {
    const {post, postList, postNav, data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getPostColumnClasses = () => {
        return (data?.show_sidebar) ? "col-12 col-md-8 col-lg-8" : "col-12";
    }
    const getSidebarClasses = () => {
        return (data?.show_sidebar) ? "col-12 col-md-4 col-lg-4" : "col-12";
    }


    function getCategory(categories) {
        if (Array.isArray(categories) && categories?.length > 0) {
            return categories[0]
        }
        return null
    }

    const listingsManager = new ListingsManager();
    function getItemUrl(item) {
        return listingsManager.getListingsEngine().getItemLinkProps({
            displayAs: DISPLAY_AS_LIST,
            item,
            source: 'wordpress',
            // trackData: {
            //     dataLayerName: "listItemClick",
            //     dataLayer: {
            //         provider: props.data.provider,
            //         category: props.searchCategory,
            //         item_id: props.data.item_id,
            //         user_id: props.user[SESSION_USER_ID] || "unregistered",
            //         user_email: props.user[SESSION_USER_EMAIL] || "unregistered",
            //     },
            // }
        })
    }
    const linkProps = getItemUrl(post);
    return (
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-12">

                        <div className="single-post">

                            <div className="post-title-area">
                                {/*{isNotEmpty(props.item.provider) &&*/}
                                {/*    <a className="post-cat" href="#">{props?.item?.provider}</a>*/}
                                {/*}*/}
                                <h2 className="post-title">
                                    {post?.post_title}
                                </h2>
                                <div className="post-meta">
								<span className="post-author">
									By <a href="#">John Doe</a>
								</span>
                                    {post?.date_modified &&
                                        <span className="post-date">
                                            <i className="fa fa-clock-o"></i>
                                            {formatDate(post.date_modified)}
                                        </span>
                                    }
                                    <span className="post-hits"><i className="fa fa-eye"></i> 21</span>
                                    <span className="post-comment"><i className="fa fa-comments-o"></i>
								<a href="#" className="comments-link"><span>01</span></a></span>
                                </div>
                            </div>

                            <div className="post-content-area">
                                {isNotEmpty(post?.featured_image) && (
                                    <div className="post-media post-featured-image">
                                        <a href="#" className="gallery-popup">
                                            <img src={post.featured_image}
                                                 className="img-fluid" alt=""/>
                                        </a>
                                    </div>
                                )}
                                <div className="entry-content">
                                    {parse(post?.post_content ? post.post_content : "")}
                                </div>

                                {templateManager.render(
                                    <BlogCategoryList
                                        categories={post?.categories || []}
                                    />
                                )}

                                {linkProps?.href && templateManager.render(
                                    <SocialShareWidget
                                        href={linkProps.href}
                                        text={post?.post_title}
                                    />
                                )}

                            </div>
                        </div>

                        {templateManager.render(
                            <PostNavigation
                                navigation={props?.postNav || {}}
                                source={props?.type}
                            />
                        )}

                        <ItemViewComments
                            category={props?.category}
                            provider={props?.item?.provider}
                            item_id={props?.item?.item_id || props?.item?.ID}
                        />

                    </div>
                </div>
            </div>
        </section>
    );
};

PostItemBlock.category = 'public';
PostItemBlock.templateId = 'postItemBlock';

function mapStateToProps(state) {
    return {
        post: state.page.postData,
        page: state.page.pageData,
        postList: state.page.postListData,
        postNav: state.page.postNavData,
    };
}

export default connect(
    mapStateToProps,
    null
)(PostItemBlock);
