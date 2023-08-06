import React from 'react';
import {connect} from "react-redux";
import HtmlParser from "react-html-parser";
import BlogCategoryList from "../widgets/BlogCategoryList";
import {isNotEmpty, isObjectEmpty, isSet} from "../../library/utils";
import {getNextPostFromList, getPostItemUrl, getPrevPostFromList} from "../../library/helpers/posts";
import Link from "next/link";
import {setPostNavIndexAction} from "../../redux/actions/page-actions";

const PostItemBlock = ({data, post, postList, postNav}) => {
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

    return (
        <section className="blog_area single-post-area section-padding">
            <div className="container">
                <div className="row">
                    <div className={`${getPostColumnClasses()} posts-list`}>
                        <div className="single-post">
                            <h1>{post?.title}</h1>
                            <div className="feature-img">
                                <img className="img-fluid" src={post?.featuredImage?.node?.mediaItemUrl} alt=""/>
                            </div>
                            <div className="blog_details">
                                <h2>{post?.title}</h2>

                                <BlogCategoryList
                                    categories={post?.categories?.nodes}
                                    classes={"blog-info-link mt-3 mb-4"}
                                />
                                <>{HtmlParser(post?.content ? post.content : "")}</>
                            </div>
                        </div>
                        <div className="navigation-top">
                            <div className="d-sm-flex justify-content-between text-center">
                                <p className="like-info">
                                    <span className="align-middle">
                                        <i className="fa fa-heart"/>
                                    </span>
                                    Lily and 4 people like this
                                </p>
                                <div className="col-sm-4 text-center my-2 my-sm-0">
                                </div>
                                <ul className="social-icons">
                                    <li><a href="#"><i className="fa fa-facebook-f"/></a></li>
                                    <li><a href="#"><i className="fa fa-twitter"/></a></li>
                                    <li><a href="#"><i className="fa fa-dribbble"/></a></li>
                                    <li><a href="#"><i className="fa fa-behance"/></a></li>
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
                                                        post_name: prevPost?.slug || prevPost?.post_name,
                                                        category_name: prevPost?.post_options?.postTemplateCategory?.slug || prevPost?.post_template_category?.slug
                                                    })}
                                                 onClick={prevPostClickHandler}>
                                                    <img className="img-fluid"
                                                         src={prevPost?.featuredImage?.node?.mediaItemUrl || prevPost?.featured_image}
                                                         alt=""/>
                                                </Link>
                                            </div>
                                            <div className="arrow">
                                                <Link
                                                    href={getPostItemUrl({
                                                        post_name: prevPost?.slug || prevPost?.post_name,
                                                        category_name: prevPost?.post_options?.postTemplateCategory?.slug || prevPost?.post_template_category?.slug
                                                    })}
                                                 onClick={prevPostClickHandler}>
                                                    <span className="lnr text-white ti-arrow-left"/>

                                                </Link>
                                            </div>
                                            <div className="detials">
                                                <p>Prev Post</p>
                                                <Link
                                                    href={getPostItemUrl({
                                                        post_name: prevPost?.slug || prevPost?.post_name,
                                                        category_name: prevPost?.post_options?.postTemplateCategory?.slug || prevPost?.post_template_category?.slug
                                                    })}
                                                 onClick={prevPostClickHandler}>
                                                    <h4>{prevPost?.title || prevPost?.post_title}</h4>

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
                                                        post_name: nextPost?.slug || nextPost?.post_name,
                                                        category_name: nextPost?.post_options?.postTemplateCategory?.slug || nextPost?.post_template_category?.slug
                                                    })}
                                                 onClick={nextPostClickHandler}>
                                                    <h4>{nextPost?.title || nextPost?.post_title}</h4>

                                                </Link>
                                            </div>
                                            <div className="arrow">
                                                <Link
                                                    href={getPostItemUrl({
                                                        post_name: nextPost?.slug || nextPost?.post_name,
                                                        category_name: nextPost?.post_options?.postTemplateCategory?.slug || nextPost?.post_template_category?.slug
                                                    })}
                                                 onClick={nextPostClickHandler}>
                                                    <span className="lnr text-white ti-arrow-right"/>

                                                </Link>
                                            </div>
                                            <div className="thumb">
                                                <Link
                                                    href={getPostItemUrl({
                                                        post_name: nextPost?.slug || nextPost?.post_name,
                                                        category_name: nextPost?.post_options?.postTemplateCategory?.slug || nextPost?.post_template_category?.slug
                                                    })}
                                                 onClick={nextPostClickHandler}>
                                                        <img className="img-fluid"
                                                             src={nextPost?.featuredImage?.node?.mediaItemUrl || nextPost?.featured_image}
                                                             alt=""/>

                                                </Link>
                                            </div>
                                        </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data?.show_sidebar &&
                    <div className={`${getSidebarClasses()}`}>
                        <div className="blog_right_sidebar">
                            <aside className="single_sidebar_widget search_widget">
                                <form action="#">
                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" placeholder='Search Keyword'
                                                   onFocus="this.placeholder = ''"
                                                   onBlur="this.placeholder = 'Search Keyword'"/>
                                            <div className="input-group-append">
                                                <button className="btn" type="button"><i className="ti-search"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                                            type="submit">Search
                                    </button>
                                </form>
                            </aside>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </section>
    );
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
