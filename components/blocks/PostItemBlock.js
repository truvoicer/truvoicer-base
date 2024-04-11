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
import ListingsLeftSidebar from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsLeftSidebar";
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
    //console.log({data, post, postNav})
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
    console.log(props)
    return (
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">

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

                    <div className="col-lg-4 col-md-12">
                        <div className="sidebar sidebar-right">
                            <div className="widget">
                                <h3 className="block-title"><span>Follow Us</span></h3>

                                {templateManager.render(<SocialFollowWidget/>)}
                            </div>

                            <div className="widget color-default">
                                <h3 className="block-title"><span>Popular News</span></h3>

                                <div className="post-overaly-style clearfix">
                                    <div className="post-thumb">
                                        <a href="#">
                                            <img className="img-fluid" src="images/news/lifestyle/health4.jpg" alt=""/>
                                        </a>
                                    </div>

                                    <div className="post-content">
                                        <a className="post-cat" href="#">Health</a>
                                        <h2 className="post-title title-small">
                                            <a href="#">Smart packs parking sensor tech and beeps when col…</a>
                                        </h2>
                                        <div className="post-meta">
                                            <span className="post-date">Feb 06, 2017</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="list-post-block">
                                    <ul className="list-post">
                                        <li className="clearfix">
                                            <div className="post-block-style post-float clearfix">
                                                <div className="post-thumb">
                                                    <a href="#">
                                                        <img className="img-fluid" src="images/news/tech/gadget3.jpg"
                                                             alt=""/>
                                                    </a>
                                                    <a className="post-cat" href="#">Gadgets</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Panasonic's new Sumix CH7 an ultra portable
                                                            filmmaker's drea…</a>
                                                    </h2>
                                                    <div className="post-meta">
                                                        <span className="post-date">Mar 13, 2017</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="clearfix">
                                            <div className="post-block-style post-float clearfix">
                                                <div className="post-thumb">
                                                    <a href="#">
                                                        <img className="img-fluid"
                                                             src="images/news/lifestyle/travel5.jpg" alt=""/>
                                                    </a>
                                                    <a className="post-cat" href="#">Travel</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Hynopedia helps female travelers find health
                                                            care...</a>
                                                    </h2>
                                                    <div className="post-meta">
                                                        <span className="post-date">Jan 11, 2017</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="clearfix">
                                            <div className="post-block-style post-float clearfix">
                                                <div className="post-thumb">
                                                    <a href="#">
                                                        <img className="img-fluid" src="images/news/tech/robot5.jpg"
                                                             alt=""/>
                                                    </a>
                                                    <a className="post-cat" href="#">Robotics</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Robots in hospitals can be quite handy to navigate
                                                            around...</a>
                                                    </h2>
                                                    <div className="post-meta">
                                                        <span className="post-date">Feb 19, 2017</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li className="clearfix">
                                            <div className="post-block-style post-float clearfix">
                                                <div className="post-thumb">
                                                    <a href="#">
                                                        <img className="img-fluid" src="images/news/lifestyle/food1.jpg"
                                                             alt=""/>
                                                    </a>
                                                    <a className="post-cat" href="#">Food</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Tacos ditched the naked chicken chalupa, so here's
                                                            how…</a>
                                                    </h2>
                                                    <div className="post-meta">
                                                        <span className="post-date">Feb 27, 2017</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                </div>

                            </div>

                            <div className="widget text-center">
                                <img className="banner img-fluid" src="images/banner-ads/ad-sidebar.png" alt=""/>
                            </div>

                            <div className="widget widget-tags">
                                <h3 className="block-title"><span>Tags</span></h3>
                                <ul className="unstyled clearfix">
                                    <li><a href="#">Apps</a></li>
                                    <li><a href="#">Architechture</a></li>
                                    <li><a href="#">Food</a></li>
                                    <li><a href="#">Gadgets</a></li>
                                    <li><a href="#">Games</a></li>
                                    <li><a href="#">Health</a></li>
                                    <li><a href="#">Lifestyles</a></li>
                                    <li><a href="#">Robotics</a></li>
                                    <li><a href="#">Software</a></li>
                                    <li><a href="#">Tech</a></li>
                                    <li><a href="#">Travel</a></li>
                                    <li><a href="#">Video</a></li>
                                </ul>
                            </div>

                            <div className="widget m-bottom-0">
                                <h3 className="block-title"><span>Newsletter</span></h3>
                                <div className="ts-newsletter">
                                    <div className="newsletter-introtext">
                                        <h4>Get Updates</h4>
                                        <p>Subscribe our newsletter to get the best stories into your inbox!</p>
                                    </div>

                                    <div className="newsletter-form">
                                        <form action="#" method="post">
                                            <div className="form-group">
                                                <input type="email" name="email" id="newsletter-form-email"
                                                       className="form-control form-control-lg" placeholder="E-mail"
                                                       autocomplete="off"/>
                                                <button className="btn btn-primary">Subscribe</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
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
