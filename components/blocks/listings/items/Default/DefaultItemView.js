import React, {useContext} from 'react';
import {formatDate, isNotEmpty} from "@/truvoicer-base/library/utils";
import parse from 'html-react-parser';
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faEnvelope, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faGooglePlus, faTwitter} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import {template} from "underscore";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import BlogCategoryList from "@/truvoicer-base/components/widgets/BlogCategoryList";
import PostNavigation from "@/truvoicer-base/components/widgets/post/PostNavigation";
import SocialShareWidget from "@/truvoicer-base/components/widgets/SocialShareWidget";
import SocialFollowWidget from "@/truvoicer-base/components/widgets/SocialFollowWidget";

const DefaultItemView = (props) => {
    const extraData = props.data?.extra_data;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    // const itemId = listingsManager.listingsEngine.extractItemId(props.data);

    // const savedItem = listingsManager.searchEngine.isSavedItemAction(
    //     itemId,
    //     props?.data?.provider,
    //     props.searchCategory,
    //     props.user[SESSION_USER_ID]
    // );
    //
    // const ratingsData = listingsManager.searchEngine.getItemRatingDataAction(
    //     itemId,
    //     props?.data?.provider,
    //     props.searchCategory,
    //     props.user[SESSION_USER_ID]
    // );
    return (
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">

                        <div className="single-post">

                            <div className="post-title-area">
                                {isNotEmpty(props.item.provider) &&
                                    <a className="post-cat" href="#">{props?.item?.provider}</a>
                                }
                                <h2 className="post-title">
                                    {props.item.job_title}
                                </h2>
                                <div className="post-meta">
								<span className="post-author">
									By <a href="#">John Doe</a>
								</span>
                                    {props.data.date_expires &&
                                        <span className="post-date">
                                            <i className="fa fa-clock-o"></i>
                                            {formatDate(props.data.date_expires)}
                                        </span>
                                    }
                                    <span className="post-hits"><i className="fa fa-eye"></i> 21</span>
                                    <span className="post-comment"><i className="fa fa-comments-o"></i>
								<a href="#" className="comments-link"><span>01</span></a></span>
                                </div>
                            </div>

                            <div className="post-content-area">
                                {isNotEmpty(props.item.item_image) && (
                                    <div className="post-media post-featured-image">
                                        <a href="#" className="gallery-popup">
                                            <img src={props.item.item_image}
                                                 className="img-fluid" alt=""/>
                                        </a>
                                    </div>
                                )}
                                <div className="entry-content">
                                    {parse(props.item.job_description)}
                                </div>
                                <div className="apply_job_form white-bg mt-5">
                                    <h3 className={'title-normal'}>
                                        {getExtraDataValue("apply_section_heading", extraData) ?? "Apply for this job"}
                                    </h3>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="submit_btn">
                                                <a target={"_blank"}
                                                   href={props.item.url}
                                                   className="boxed-btn3 w-100">
                                                    {getExtraDataValue("apply_button_label", extraData) ?? "Apply Now"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {templateManager.render(
                                    <BlogCategoryList
                                        categories={props?.item?.categories || []}
                                    />
                                )}

                                {templateManager.render(
                                    <SocialShareWidget
                                        href={props?.item?.url}
                                        text={props?.item?.job_title}
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
                            category={props.category}
                            provider={props.item.provider}
                            item_id={props?.item?.item_id || props?.item?.ID}
                        />

                    </div>

                    <div className="col-lg-4 col-md-12">
                        <div className="sidebar sidebar-right">
                            <div className="widget">
                                <h3 className="block-title">
                                    <span>{getExtraDataValue("job_summary_heading", extraData) ?? "Job Summary"}</span>
                                </h3>

                                <div className="job_sumary">
                                    <div className="job_content list-post-block">
                                        <ul className={'list-post'}>
                                            <li>Published on: <span>{props.item.date_added}</span></li>
                                            {isNotEmpty(props?.item?.salary_type) &&
                                                <>
                                                    <li>Salary Type: <span>{props.item.salary_type}</span></li>
                                                </>
                                            }
                                            <li>Salary:<br/>
                                                {isNotEmpty(props?.item?.min_salary) &&
                                                    <>Min: <span>£{props.item.min_salary}</span><br/></>
                                                }
                                                {isNotEmpty(props?.item?.max_salary) &&
                                                    <>Max: <span>£{props.item.max_salary}</span><br/></>
                                                }
                                                {isNotEmpty(props?.item?.yearly_min_salary) &&
                                                    <>Yearly Min: <span>£{props.item.yearly_min_salary}</span><br/></>
                                                }
                                                {isNotEmpty(props?.item?.yearly_max_salary) &&
                                                    <>Yearly Max: <span>£{props.item.yearly_max_salary}</span></>
                                                }
                                            </li>
                                            <li>Location: <span>{props.item.location_name}</span></li>
                                            <li>Job Nature:&nbsp;
                                                <span>{props.item.part_time && "Part-time"}{props.item.full_time && "Full-time"}</span>
                                            </li>
                                        </ul>
                                        <div className="apply_job_form white-bg">
                                            <h4>{getExtraDataValue("apply_section_heading", extraData) ?? "Apply for this job"}</h4>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="submit_btn">
                                                        <a target={"_blank"}
                                                           href={props.item.url}
                                                           className="boxed-btn3 w-100">
                                                            {getExtraDataValue("apply_button_label", extraData) ?? "Apply Now"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widget">
                                <h3 className="block-title"><span>Follow Us</span></h3>

                                {templateManager.render(<SocialFollowWidget />)}
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
}

export default DefaultItemView;
