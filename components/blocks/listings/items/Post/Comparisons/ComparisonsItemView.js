import React from 'react';
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import parse from 'html-react-parser';
import ItemViewComments from "@/truvoicer-base/components/comments/ItemViewComments";
import {getExtraDataValue} from "@/truvoicer-base/library/helpers/pages";
import Image from "next/image";

const ComparisonsItemView = (props) => {

    const extraData = props.data?.extra_data;
    return (
        <div className="job_details_area">
            <div className="container section-block">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="job_details_header">
                            <div className="single_jobs white-bg d-flex justify-content-between">
                                <div className="jobs_left d-flex align-items-center">
                                    <div className="thumb">
                                        <img  src={props.item.item_logo? props.item.item_logo : "/img/pticon.png"} alt=""/>
                                    </div>
                                    <div className="jobs_conetent">
                                        <a href="#"><h4>{props.item.item_name}</h4></a>
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
                                {parse(props.item.item_description)}
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
                                <h3>{getExtraDataValue("visit_heading", extraData) ?? "Visit"}</h3>
                            </div>
                            <div className="job_content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="submit_btn">
                                            <a target={"_blank"}
                                               href={props.item.item_url}
                                               className="boxed-btn3 w-100">
                                                {getExtraDataValue("apply_button_label", extraData) ?? "Visit Site"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComparisonsItemView;
