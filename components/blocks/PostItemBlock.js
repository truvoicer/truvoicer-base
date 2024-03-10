import React, {useContext} from 'react';
import {connect} from "react-redux";
import HtmlParser from "react-html-parser";
import BlogCategoryList from "../widgets/BlogCategoryList";
import {isNotEmpty, isObjectEmpty, isSet} from "../../library/utils";
import {getNextPostFromList, getPostItemUrl, getPrevPostFromList} from "../../library/helpers/posts";
import Link from "next/link";
import {setPostNavIndexAction} from "../../redux/actions/page-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faBehance, faDribbble, faFacebookF, faTwitter} from "@fortawesome/free-brands-svg-icons";

const PostItemBlock = (props) => {
    const {post, postList, postNav, data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    //console.log({data, post, postNav})
    const getPostColumnClasses = () => {
        return (data?.show_sidebar) ? "col-12 col-md-8 col-lg-8" : "col-12";
    }
    const getSidebarClasses = () => {
        return (data?.show_sidebar) ? "col-12 col-md-4 col-lg-4" : "col-12";
    }

    const getNextPost = () => {
        if (postNav.fromList) {
            return getNextPostFromList(postNav.index, postList);
        }
        if (!isNotEmpty(postNav?.nextPost)) {
            return {};
        }
        return postNav.nextPost;
    }

    const getPrevPost = () => {
        if (postNav.fromList) {
            return getPrevPostFromList(postNav.index, postList);
        }
        if (!isNotEmpty(postNav.prevPost)) {
            return {};
        }
        return postNav.prevPost;
    }

    const prevPostClickHandler = () => {
        if (postNav.fromList && postNav.index !== null && postNav.index > 0) {
            setPostNavIndexAction(postNav.index - 1)
        }
    }

    const nextPostClickHandler = () => {
        if (postNav.fromList && postNav.index !== null && postNav.index < postList.length) {
            setPostNavIndexAction(postNav.index + 1)
        }
    }

    const prevPost = getPrevPost();
    const nextPost = getNextPost();

    function getCategory(categories) {
        if (Array.isArray(categories) && categories?.length > 0) {
            return categories[0]
        }
        return null
    }

    const prevPostCategory = getCategory(prevPost?.categories);
    const nextPostCategory = getCategory(nextPost?.categories);

    function defaultView() {
        return (
            <section className="blog_area single-post-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className={`${getPostColumnClasses()} posts-list`}>
                            <div className="single-post">
                                <h1>{post?.post_title}</h1>
                                <div className="blog_details">
                                    <BlogCategoryList
                                        categories={post?.categories}
                                        classes={"blog-info-link mt-3 mb-4"}
                                    />
                                    <>{HtmlParser(post?.post_content ? post.post_content : "")}</>
                                </div>
                            </div>
                            <div className="navigation-top">
                                <div className="d-sm-flex justify-content-between text-center">
                                    <p className="like-info">
                                    <span className="align-middle">
                                        <FontAwesomeIcon icon={faHeart} />
                                    </span>
                                        Lily and 4 people like this
                                    </p>
                                    <div className="col-sm-4 text-center my-2 my-sm-0">
                                    </div>
                                    <ul className="social-icons">
                                        <li><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
                                        <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                                        <li><a href="#"><FontAwesomeIcon icon={faDribbble} /></a></li>
                                        <li><a href="#"><FontAwesomeIcon icon={faBehance} /></a></li>
                                    </ul>
                                </div>
                                <div className="navigation-area">
                                    <div className="row">
                                        <div
                                            className="col-lg-6 col-md-6 col-12 nav-left flex-row d-flex justify-content-start align-items-center">
                                            {!isObjectEmpty(prevPost) &&
                                                <>
                                                    <div className="thumb">
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  prevPost?.post_name,
                                                                category_name: prevPostCategory?.slug
                                                            })}
                                                            onClick={prevPostClickHandler}>
                                                            <img className="img-fluid"
                                                                 src={prevPost?.featured_image}
                                                                 alt=""/>
                                                        </Link>
                                                    </div>
                                                    <div className="arrow">
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  prevPost?.post_name,
                                                                category_name: prevPostCategory?.slug
                                                            })}
                                                            onClick={prevPostClickHandler}>
                                                            <span className="lnr text-white ti-arrow-left"/>

                                                        </Link>
                                                    </div>
                                                    <div className="detials">
                                                        <p>Prev Post</p>
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  prevPost?.post_name,
                                                                category_name: prevPostCategory?.slug
                                                            })}
                                                            onClick={prevPostClickHandler}>
                                                            <h4>{prevPost?.post_title}</h4>

                                                        </Link>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div
                                            className="col-lg-6 col-md-6 col-12 nav-right flex-row d-flex justify-content-end align-items-center">
                                            {!isObjectEmpty(nextPost) &&
                                                <>
                                                    <div className="detials">
                                                        <p>Next Post</p>
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  nextPost?.post_name,
                                                                category_name: nextPostCategory?.slug
                                                            })}
                                                            onClick={nextPostClickHandler}>
                                                            <h4>{nextPost?.post_title}</h4>

                                                        </Link>
                                                    </div>
                                                    <div className="arrow">
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  nextPost?.post_name,
                                                                category_name: nextPostCategory?.slug
                                                            })}
                                                            onClick={nextPostClickHandler}>
                                                            <span className="lnr text-white ti-arrow-right"/>

                                                        </Link>
                                                    </div>
                                                    <div className="thumb">
                                                        <Link
                                                            href={getPostItemUrl({
                                                                post_name:  nextPost?.post_name,
                                                                category_name: nextPostCategory?.slug
                                                            })}
                                                            onClick={nextPostClickHandler}>
                                                            <img className="img-fluid"
                                                                 src={nextPost?.featured_image}
                                                                 alt=""/>

                                                        </Link>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"pt-5"}>
                                <ItemViewComments
                                    category={props.category}
                                    provider={props.item.provider}
                                    item_id={props.item.item_id}
                                />
                            </div>
                        </div>
                        {data?.show_sidebar &&
                            <div className={`${getSidebarClasses()}`}>
                                <div className="blog_right_sidebar">
                                    <ListingsLeftSidebar sidebarName={data?.select_sidebar} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'postItemBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getPostColumnClasses: getPostColumnClasses,
            getSidebarClasses: getSidebarClasses,
            prevPostClickHandler: prevPostClickHandler,
            nextPostClickHandler: nextPostClickHandler,
            getNextPost: getNextPost,
            getPrevPost: getPrevPost,
            ...props
        }
    })
};

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
