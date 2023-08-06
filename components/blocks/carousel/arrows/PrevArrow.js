import React from "react";

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div className={"owl-prev"} onClick={onClick} style={{ ...style, display: "block" }}>
            <i className="fa fa-angle-left"/>
        </div>
    );
}
export default PrevArrow;