import React from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import parse from 'html-react-parser';
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import {SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faEnvelope, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faGooglePlus, faTwitter} from "@fortawesome/free-brands-svg-icons";

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
        <div className="job_details_area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="job_details_header">
                            <div className="single_jobs white-bg d-flex justify-content-between">
                                <div className="jobs_left d-flex align-items-center">
                                    <div className="thumb">
                                        <img src={props.item.default_image? props.item.default_image : "/img/pticon.png"} alt=""/>
                                    </div>
                                    <div className="jobs_conetent">
                                        <a href="#"><h4>{props.item.job_title}</h4></a>
                                        <div className="links_locat d-flex align-items-center">
                                            <div className="location">
                                                <p><FontAwesomeIcon icon={faMapMarker} /> {props.item.location_name}</p>
                                            </div>
                                            <div className="location">
                                                <p><FontAwesomeIcon icon={faClock} />
                                                    {props.item.part_time && "Part-time"}
                                                    {props.item.full_time && "Full-time"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="jobs_right">
                                    <div className="apply_now">
                                        <a className="heart_mark" href="#"> <i className="ti-heart"/> </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="descript_wrap white-bg">
                            <div className="single_wrap">
                                {parse(props.item.job_description)}
                            </div>
                        </div>
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
                        <div className={"pt-5"}>
                            <ItemViewComments
                                category={props.category}
                                provider={props.item.provider}
                                item_id={props.item.item_id}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="job_sumary">
                            <div className="summery_header">
                                <h3>{getExtraDataValue("job_summary_heading", extraData) ?? "Job Summary"}</h3>
                            </div>
                            <div className="job_content">
                                <ul>
                                    <li>Published on: <span>{props.item.date_added}</span></li>
                                    {isNotEmpty(props?.item?.salary_type) &&
                                    <><li>Salary Type: <span>{props.item.salary_type}</span></li></>
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
                                        <span>
                                            {props.item.part_time && "Part-time"}
                                            {props.item.full_time && "Full-time"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="share_wrap d-flex">
                        {/*    <span>{getExtraDataValue("social_icons_label", extraData) ?? "Share:"}</span>*/}
                        {/*    <ul>*/}
                        {/*        <li><a href="#"> <FontAwesomeIcon icon={faFacebook} /></a></li>*/}
                        {/*        <li><a href="#"> <FontAwesomeIcon icon={faGooglePlus} /></a></li>*/}
                        {/*        <li><a href="#"> <FontAwesomeIcon icon={faTwitter} /></a></li>*/}
                        {/*        <li><a href="#"> <FontAwesomeIcon icon={faEnvelope} /></a></li>*/}
                        {/*    </ul>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultItemView;
