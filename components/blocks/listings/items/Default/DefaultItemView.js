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
import SocialShareWidget from "@/truvoicer-base/components/widgets/Social/SocialShareWidget";

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
                    <div className="col-12">

                        <div className="single-post">

                            <div className="post-title-area">
                                {isNotEmpty(props.item.provider) &&
                                    <a className="post-cat" href="#">{props?.item?.provider}</a>
                                }
                                <h2 className="post-title">
                                    {props.item.item_title}
                                </h2>
                                <div className="post-meta">
								<span className="post-author">
									By <a href="#">John Doe</a>
								</span>
                                    {props.data.item_date &&
                                        <span className="post-date">
                                            <i className="fa fa-clock-o"></i>
                                            {formatDate(props.data.item_date)}
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
                                    {parse(props?.item?.item_description || '')}
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
                                        text={props?.item?.item_title}
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
                </div>
            </div>
        </section>
    );
}
DefaultItemView.category = 'views';
DefaultItemView.templateId = 'defaultItemView';
export default DefaultItemView;
