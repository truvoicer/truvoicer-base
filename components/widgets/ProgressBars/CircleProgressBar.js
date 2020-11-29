import React from 'react';
import {isNotEmpty} from "../../../library/utils";

function CircleProgressBar({percent, textColor = null, ringColor = null, seconds = null}) {
    const textStyle = {}
    const ringColorStyle = {}
    const animationStyle = {}
    const deg = (percent / 100) * 180;

    const degStyle = {
        transform: `rotate(${deg}deg)`
    };
    if (isNotEmpty(seconds) && !isNaN(seconds)) {
        animationStyle.animation = `fill ease-in-out ${seconds}s`
    }
    if (isNotEmpty(textColor)) {
        textStyle.color = textColor
    }
    if (isNotEmpty(ringColor)) {
        ringColorStyle.backgroundColor = ringColor;
    }
    return (
        <div className="circle-progress-bar">
            <div className="circle">
                <div className="mask full" style={degStyle}>
                    <div className="fill" style={{...degStyle, ...ringColorStyle, ...animationStyle}}/>
                </div>
                <div className="mask half">
                    <div className="fill" style={{...degStyle, ...ringColorStyle}}/>
                </div>
                <div className="inside-circle" style={textStyle}>
                {`${percent}%`}
                </div>
            </div>
        </div>
    );
}

export default CircleProgressBar;