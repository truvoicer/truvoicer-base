import React, {useContext} from 'react';
import parse from 'html-react-parser';
import {faClock, faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";

const PostItemView = (props) => {

    return (
        <section className="blog_area single-post-area section-padding">
            <div className={"single-blog-nav"}>
                <a >
                    <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
                </a>
            </div>
            <div className="container section-block">
                <div className="row">
                    <div className="col-lg-12 posts-list">
                        <div className="single-post">
                            <div className="feature-img">
                                <img  className="img-fluid"
                                     src={props.data.item_default_image? props.data.item_default_image : ""}
                                     alt=""/>
                            </div>
                            <div className="blog_details">
                                {parse(props.data.item_content || props.data.item_summary)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PostItemView;
