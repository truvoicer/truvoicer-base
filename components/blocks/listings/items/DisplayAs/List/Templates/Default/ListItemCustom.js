import React from "react";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faMapMarker} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const ListItemCustom = (props) => {
    return (

        <div className="single_jobs white-bg d-flex justify-content-between">
            <div className="jobs_left d-flex align-items-center">
                <div className="thumb">
                    <img  src={props.data.item_image} alt={""}/>
                </div>
                <div className="jobs_conetent">
                    <a
                        href={props.data.item_link}
                        className="game-title"
                        target={"_blank"}
                    >
                        <span className={"thumb-label"}>{props.data.item_text}</span>
                        <h4>{props.data.item_header}</h4>
                    </a>
                    <div className="links_locat d-flex align-items-center">
                        {/*<div className="location">*/}
                        {/*    <p><FontAwesomeIcon icon={faMapMarker} /> {props.data.item_location}</p>*/}
                        {/*</div>*/}
                        {/*<div className="location">*/}
                        {/*    <p><FontAwesomeIcon icon={faClock} /> Applications: {props.data.item_application_count}</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
            <div className="jobs_right">
                <div className="apply_now">
                    {/*<SavedItemToggle*/}
                    {/*    provider={props.data.provider}*/}
                    {/*    category={props.searchCategory}*/}
                    {/*    item_id={props.data.item_id}*/}
                    {/*    user_id={props.user[SESSION_USER_ID]}*/}
                    {/*    savedItem={props.savedItem}*/}
                    {/*/>*/}
                    <a className="heart_mark" href="#"> <i className="ti-heart"/> </a>
                    <a
                        href={props.data.item_link}
                        target={"_blank"}
                        className="boxed-btn3"
                    >Apply Now</a>
                </div>
                <div className="date">
                    {/*<p>{formatDate(props.data.item_date)}</p>*/}
                </div>
            </div>
        </div>
    )
}

ListItemCustom.category = 'listings';
ListItemCustom.templateId = 'listItemCustom';
export default connect(
    null,
    null
)(ListItemCustom);
