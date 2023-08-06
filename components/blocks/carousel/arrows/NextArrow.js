import React from "react";

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={"owl-next"} onClick={onClick} style={{ ...style, display: "block" }}>
            <i className="fa fa-angle-right"/>
        </div>
    );
}
export default NextArrow;