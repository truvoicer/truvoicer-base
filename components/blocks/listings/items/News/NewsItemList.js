import React, {useContext} from "react";
import {formatDate} from "@/truvoicer-base/library/utils";
import {SESSION_USER} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import parse from 'html-react-parser';
import {BlogContext} from "@/truvoicer-base/config/contexts/BlogContext";
import {faClock, faComments, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";

const NewsItemList = (props) => {

    const blogContext = useContext(BlogContext);
    return (
        <article className="blog_item">
            <div className="blog_item_img">
                <Image
                    className="card-img rounded-0"
                    src={props.data.item_default_image? props.data.item_default_image : ""}
                    alt=""
                />
                    <a onClick={blogContext.itemLinkClickHandler.bind(this, props.data, true)} className="blog_item_date">
                        <h3>{formatDate(props.data.item_date, "D")}</h3>
                        <p>{formatDate(props.data.item_date, "MMM")}</p>
                    </a>
            </div>

            <div className="blog_details">
                <a className="d-inline-block" onClick={blogContext.itemLinkClickHandler.bind(this, props.data)}>
                    <h2>{props.data.item_title}</h2>
                </a>
                {parse(props.data.item_summary)}
                <ul className="blog-info-link">
                    <li><a href="#"><FontAwesomeIcon icon={faUser} />{props.data.item_category}</a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faComments} /> 03 Comments</a></li>
                </ul>
            </div>
        </article>
    )
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(NewsItemList);
