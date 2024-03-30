import React, {useContext} from 'react';
import parse from 'html-react-parser';
import {BlogContext} from "@/truvoicer-base/config/contexts/BlogContext";
import {faClock, faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NewsItemView = (props) => {

    const blogContext = useContext(BlogContext);
    return (
        <section className="blog_area single-post-area section-padding">
            <div className={"single-blog-nav"}>
                <a onClick={blogContext.itemLinkClickHandler.bind(this, props.data, false)}>
                    <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
                </a>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 posts-list">
                        <div className="single-post">
                            <div className="feature-img">
                                <img className="img-fluid"
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

export default NewsItemView;
