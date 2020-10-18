import React from 'react';

const TextWidget = (props) => {
    return (
        <>
            <div className="single-footer-widget mb-70">
                <div className="widget-title">
                    <h4>{props.data.title}</h4>
                </div>
                <div className="widget-content">
                    <p>{props.data.text}</p>
                </div>
            </div>
        </>
    );
}

export default TextWidget;
