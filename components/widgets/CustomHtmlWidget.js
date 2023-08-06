import React from 'react';
import HtmlParser from "react-html-parser";
import {isNotEmpty} from "../../library/utils";

const CustomHtmlWidget = (props) => {
    return (
        <div className="col-xl-3 col-md-6 col-lg-3">
            <div className="footer_widget wow fadeInUp" data-wow-duration="1.3s" data-wow-delay=".6s">
                {props?.data?.title &&
                <h3 className="footer_title">
                    {props.data.title}
                </h3>
                }
                {isNotEmpty(props?.data?.content) ? HtmlParser(props.data.content) : ""}
            </div>
        </div>
    );
}

export default CustomHtmlWidget;
