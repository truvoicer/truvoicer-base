import React from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import parse from 'html-react-parser';
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faEnvelope, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faGooglePlus, faTwitter} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

const DefaultItemView = (props) => {
    const extraData = props.data?.extra_data;

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
    // console.log({props})
    return (
        // <div className="job_details_area">
        //     <div className="container">
        //         <div className="row">
        //             <div className="col-lg-8">
        //                 <div className="job_details_header">
        //                     <div className="single_jobs white-bg d-flex justify-content-between">
        //                         <div className="jobs_left d-flex align-items-center">
        //                             <div className="thumb">
        //                                 <img  src={props.item.default_image? props.item.default_image : "/img/pticon.png"} alt=""/>
        //                             </div>
        //                             <div className="jobs_conetent">
        //                                 <a href="#"><h4>{props.item.job_title}</h4></a>
        //                                 <div className="links_locat d-flex align-items-center">
        //                                     <div className="location">
        //                                         <p><FontAwesomeIcon icon={faMapMarker} /> {props.item.location_name}</p>
        //                                     </div>
        //                                     <div className="location">
        //                                         <p><FontAwesomeIcon icon={faClock} />
        //                                             {props.item.part_time && "Part-time"}
        //                                             {props.item.full_time && "Full-time"}
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="jobs_right">
        //                             <div className="apply_now">
        //                                 <a className="heart_mark" href="#"> <i className="ti-heart"/> </a>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="descript_wrap white-bg">
        //                     <div className="single_wrap">
        //                         {parse(props.item.job_description)}
        //                     </div>
        //                 </div>
        //                 <div className="apply_job_form white-bg">
        //                     <h4>{getExtraDataValue("apply_section_heading", extraData) ?? "Apply for this job"}</h4>
        //
        //                     <div className="row">
        //                         <div className="col-md-12">
        //                             <div className="submit_btn">
        //                                 <a target={"_blank"}
        //                                    href={props.item.url}
        //                                     className="boxed-btn3 w-100">
        //                                     {getExtraDataValue("apply_button_label", extraData) ?? "Apply Now"}
        //                                 </a>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className={"pt-5"}>
        //                     <ItemViewComments
        //                         category={props.category}
        //                         provider={props.item.provider}
        //                         item_id={props.item.item_id}
        //                     />
        //                 </div>
        //             </div>
        //             <div className="col-lg-4">
        //                 <div className="job_sumary">
        //                     <div className="summery_header">
        //                         <h3>{getExtraDataValue("job_summary_heading", extraData) ?? "Job Summary"}</h3>
        //                     </div>
        //                     <div className="job_content">
        //                         <ul>
        //                             <li>Published on: <span>{props.item.date_added}</span></li>
        //                             {isNotEmpty(props?.item?.salary_type) &&
        //                             <><li>Salary Type: <span>{props.item.salary_type}</span></li></>
        //                             }
        //                             <li>Salary:<br/>
        //                                 {isNotEmpty(props?.item?.min_salary) &&
        //                                     <>Min: <span>£{props.item.min_salary}</span><br/></>
        //                                 }
        //                                 {isNotEmpty(props?.item?.max_salary) &&
        //                                     <>Max: <span>£{props.item.max_salary}</span><br/></>
        //                                 }
        //                                 {isNotEmpty(props?.item?.yearly_min_salary) &&
        //                                     <>Yearly Min: <span>£{props.item.yearly_min_salary}</span><br/></>
        //                                 }
        //                                 {isNotEmpty(props?.item?.yearly_max_salary) &&
        //                                     <>Yearly Max: <span>£{props.item.yearly_max_salary}</span></>
        //                                 }
        //                             </li>
        //                             <li>Location: <span>{props.item.location_name}</span></li>
        //                             <li>Job Nature:&nbsp;
        //                                 <span>
        //                                     {props.item.part_time && "Part-time"}
        //                                     {props.item.full_time && "Full-time"}
        //                                 </span>
        //                             </li>
        //                         </ul>
        //                     </div>
        //                 </div>
        //                 <div className="share_wrap d-flex">
        //                 {/*    <span>{getExtraDataValue("social_icons_label", extraData) ?? "Share:"}</span>*/}
        //                 {/*    <ul>*/}
        //                 {/*        <li><a href="#"> <FontAwesomeIcon icon={faFacebook} /></a></li>*/}
        //                 {/*        <li><a href="#"> <FontAwesomeIcon icon={faGooglePlus} /></a></li>*/}
        //                 {/*        <li><a href="#"> <FontAwesomeIcon icon={faTwitter} /></a></li>*/}
        //                 {/*        <li><a href="#"> <FontAwesomeIcon icon={faEnvelope} /></a></li>*/}
        //                 {/*    </ul>*/}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">

                        <div className="single-post">

                            <div className="post-title-area">
                                <a className="post-cat" href="#">Health</a>
                                <h2 className="post-title">
                                    {props.item.job_title}
                                </h2>
                                <div className="post-meta">
								<span className="post-author">
									By <a href="#">John Doe</a>
								</span>
                                    <span className="post-date"><i className="fa fa-clock-o"></i> March 14, 2017</span>
                                    <span className="post-hits"><i className="fa fa-eye"></i> 21</span>
                                    <span className="post-comment"><i className="fa fa-comments-o"></i>
								<a href="#" className="comments-link"><span>01</span></a></span>
                                </div>
                            </div>

                            <div className="post-content-area">
                                <div className="post-media post-featured-image">
                                    <a href="images/news/lifestyle/health5.jpg" className="gallery-popup"><img src="images/news/lifestyle/health5.jpg" className="img-fluid" alt=""/></a>
                                </div>
                                <div className="entry-content">
                                    {parse(props.item.job_description)}
                                </div>

                                <div className="tags-area clearfix">
                                    <div className="post-tags">
                                        <span>Tags:</span>
                                        <a href="#"># Food</a>
                                        <a href="#"># Lifestyle</a>
                                        <a href="#"># Travel</a>
                                    </div>
                                </div>

                                <div className="share-items clearfix">
                                    <ul className="post-social-icons unstyled">
                                        <li className="facebook">
                                            <a href="#">
                                                <i className="fa fa-facebook"></i> <span className="ts-social-title">Facebook</span></a>
                                        </li>
                                        <li className="twitter">
                                            <a href="#">
                                                <i className="fa fa-twitter"></i> <span className="ts-social-title">Twitter</span></a>
                                        </li>
                                        <li className="gplus">
                                            <a href="#">
                                                <i className="fa fa-google-plus"></i> <span className="ts-social-title">Google +</span></a>
                                        </li>
                                        <li className="pinterest">
                                            <a href="#">
                                                <i className="fa fa-pinterest"></i> <span className="ts-social-title">Pinterest</span></a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>

                        <nav className="post-navigation clearfix">
                            <div className="post-previous">
                                <a href="#">
                                    <span><i className="fa fa-angle-left"></i>Previous Post</span>
                                    <h3>
                                        Deleting fears from the brain means you might never need to face them
                                    </h3>
                                </a>
                            </div>
                            <div className="post-next">
                                <a href="#">
                                    <span>Next Post <i className="fa fa-angle-right"></i></span>
                                    <h3>
                                        Smart packs parking sensor tech and beeps when collisions
                                    </h3>
                                </a>
                            </div>
                        </nav>

                        <div className="author-box">
                            <div className="author-img pull-left">
                                <img src="images/news/author.png" alt=""/>
                            </div>
                            <div className="author-info">
                                <h3>Razon Khan</h3>
                                <p className="author-url"><a href="#">http://www.newsdaily247.com</a></p>
                                <p>Selfies labore, leggings cupidatat sunt taxidermy umami fanny pack typewriter hoodie art party voluptate. Listicle meditation paleo, drinking vinegar sint direct trade.</p>
                                <div className="authors-social">
                                    <span>Follow Me: </span>
                                    <a href="#"><i className="fa fa-behance"></i></a>
                                    <a href="#"><i className="fa fa-twitter"></i></a>
                                    <a href="#"><i className="fa fa-facebook"></i></a>
                                    <a href="#"><i className="fa fa-google-plus"></i></a>
                                    <a href="#"><i className="fa fa-pinterest-p"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="related-posts block">
                            <h3 className="block-title"><span>Related Posts</span></h3>

                            <div id="latest-news-slide" className="owl-carousel owl-theme latest-news-slide">
                                <div className="item">
                                    <div className="post-block-style clearfix">
                                        <div className="post-thumb">
                                            <a href="#"><img className="img-fluid" src="images/news/lifestyle/travel5.jpg" alt="" /></a>
                                        </div>
                                        <a className="post-cat" href="#">Health</a>
                                        <div className="post-content">
                                            <h2 className="post-title title-medium">
                                                <a href="#">Hynopedia helps female travelers find health care in Maldivs</a>
                                            </h2>
                                            <div className="post-meta">
                                                <span className="post-author"><a href="#">John Doe</a></span>
                                                <span className="post-date">Feb 19, 2017</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="post-block-style clearfix">
                                        <div className="post-thumb">
                                            <a href="#"><img className="img-fluid" src="images/news/lifestyle/health5.jpg" alt="" /></a>
                                        </div>
                                        <a className="post-cat" href="#">Health</a>
                                        <div className="post-content">
                                            <h2 className="post-title title-medium">
                                                <a href="#">Netcix cuts out the chill with an integrated...</a>
                                            </h2>
                                            <div className="post-meta">
                                                <span className="post-author"><a href="#">John Doe</a></span>
                                                <span className="post-date">Feb 19, 2017</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="post-block-style clearfix">
                                        <div className="post-thumb">
                                            <a href="#"><img className="img-fluid" src="images/news/lifestyle/travel3.jpg" alt="" /></a>
                                        </div>
                                        <a className="post-cat" href="#">Travel</a>
                                        <div className="post-content">
                                            <h2 className="post-title title-medium">
                                                <a href="#">This Aeroplane that looks like a butt is the largest aircraft in the world</a>
                                            </h2>
                                            <div className="post-meta">
                                                <span className="post-author"><a href="#">John Doe</a></span>
                                                <span className="post-date">Feb 19, 2017</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="item">
                                    <div className="post-block-style clearfix">
                                        <div className="post-thumb">
                                            <a href="#"><img className="img-fluid" src="images/news/lifestyle/travel4.jpg" alt="" /></a>
                                        </div>
                                        <a className="post-cat" href="#">Travel</a>
                                        <div className="post-content">
                                            <h2 className="post-title title-medium">
                                                <a href="#">19 incredible photos from Disney's 'Star Wars' cruise algore</a>
                                            </h2>
                                            <div className="post-meta">
                                                <span className="post-author"><a href="#">John Doe</a></span>
                                                <span className="post-date">Feb 19, 2017</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <ItemViewComments
                            category={props.category}
                            provider={props.item.provider}
                            item_id={props.item.item_id}
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
                                    </div>
                                </div>
                            </div>
                            <div className="widget">
                                <h3 className="block-title"><span>Follow Us</span></h3>

                                <ul className="social-icon">
                                    <li><a href="#" target="_blank"><i className="fa fa-rss"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa fa-facebook"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa fa-twitter"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa fa-google-plus"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa fa-vimeo-square"></i></a></li>
                                    <li><a href="#" target="_blank"><i className="fa fa-youtube"></i></a></li>
                                </ul>
                            </div>

                            <div className="widget color-default">
                                <h3 className="block-title"><span>Popular News</span></h3>

                                <div className="post-overaly-style clearfix">
                                    <div className="post-thumb">
                                        <a href="#">
                                            <img className="img-fluid" src="images/news/lifestyle/health4.jpg" alt="" />
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
                                                        <img className="img-fluid" src="images/news/tech/gadget3.jpg" alt="" />
                                                    </a>
                                                    <a className="post-cat" href="#">Gadgets</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Panasonic's new Sumix CH7 an ultra portable filmmaker's drea…</a>
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
                                                        <img className="img-fluid" src="images/news/lifestyle/travel5.jpg" alt="" />
                                                    </a>
                                                    <a className="post-cat" href="#">Travel</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Hynopedia helps female travelers find health care...</a>
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
                                                        <img className="img-fluid" src="images/news/tech/robot5.jpg" alt="" />
                                                    </a>
                                                    <a className="post-cat" href="#">Robotics</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Robots in hospitals can be quite handy to navigate around...</a>
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
                                                        <img className="img-fluid" src="images/news/lifestyle/food1.jpg" alt="" />
                                                    </a>
                                                    <a className="post-cat" href="#">Food</a>
                                                </div>

                                                <div className="post-content">
                                                    <h2 className="post-title title-small">
                                                        <a href="#">Tacos ditched the naked chicken chalupa, so here's how…</a>
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
                                <img className="banner img-fluid" src="images/banner-ads/ad-sidebar.png" alt="" />
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
                                                <input type="email" name="email" id="newsletter-form-email" className="form-control form-control-lg" placeholder="E-mail" autocomplete="off" />
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
