import React, {useContext} from 'react';
import {formatDate, isNotEmpty} from "@/truvoicer-base/library/utils";
import parse from 'html-react-parser';
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import BlogCategoryList from "@/truvoicer-base/components/widgets/BlogCategoryList";
import PostNavigation from "@/truvoicer-base/components/widgets/post/PostNavigation";
import SocialShareWidget from "@/truvoicer-base/components/widgets/Social/SocialShareWidget";
import SavedItemToggle from "@/truvoicer-base/components/blocks/listings/widgets/SavedItemToggle";
import {SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import ItemRatings from "@/truvoicer-base/components/blocks/listings/widgets/ItemRatings";

const DefaultItemView = (props) => {
    const {data, item, userItemData} = props;
    const extraData = data?.extra_data;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <section className="block-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-12">

                        <div className="single-post">

                            <div className="post-title-area">
                                {isNotEmpty(item.provider) &&
                                    <a className="post-cat" href="#">{item?.provider}</a>
                                }
                                <h2 className="post-title">
                                    {item.item_title}
                                </h2>
                                <div className="post-meta">
								<span className="post-author">
									By <a href="#">John Doe</a>
								</span>
                                    {data.item_date &&
                                        <span className="post-date">
                                            <i className="fa fa-clock-o"></i>
                                            {formatDate(props.data.item_date)}
                                        </span>
                                    }
                                    <span className="post-hits"><i className="fa fa-eye"></i> 21</span>
                                    <span className="post-comment"><i className="fa fa-comments-o"></i>
								    <a href="#" className="comments-link"><span>01</span></a></span>

                                    <SavedItemToggle
                                        provider={item.provider}
                                        category={item.service?.name}
                                        item_id={item?.item_id}
                                        user_id={props.session[SESSION_USER][SESSION_USER_ID]}
                                        savedItem={userItemData?.is_saved || false}
                                    />

                                    <ItemRatings
                                        provider={item.provider}
                                        category={item.service?.name}
                                        item_id={item?.item_id}
                                        user_id={props.session[SESSION_USER][SESSION_USER_ID]}
                                        ratingsData={{
                                            rating: userItemData?.rating?.overall_rating || 0,
                                            total_users_rated: userItemData?.rating?.total_users_rated || 0
                                        }}
                                    />

                                </div>
                            </div>

                            <div className="post-content-area">
                                {isNotEmpty(item.item_image) && (
                                    <div className="post-media post-featured-image">
                                        <a href="#" className="gallery-popup">
                                            <img src={item.item_image}
                                                 className="img-fluid" alt=""/>
                                        </a>
                                    </div>
                                )}
                                <div className="entry-content">
                                    {parse(item?.item_description || '')}
                                </div>
                                <div className="apply_job_form white-bg mt-5">
                                    <h3 className={'title-normal'}>
                                        {getExtraDataValue("apply_section_heading", extraData) ?? "Apply for this job"}
                                    </h3>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="submit_btn">
                                                <a target={"_blank"}
                                                   href={item.url}
                                                   className="boxed-btn3 w-100">
                                                    {getExtraDataValue("apply_button_label", extraData) ?? "Apply Now"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {templateManager.render(
                                    <BlogCategoryList
                                        categories={item?.categories || []}
                                    />
                                )}

                                {templateManager.render(
                                    <SocialShareWidget
                                        href={item?.url}
                                        text={item?.item_title}
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
                            provider={item.provider}
                            item_id={item?.item_id || item?.ID}
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
