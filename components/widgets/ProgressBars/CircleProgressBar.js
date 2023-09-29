import React, {useContext} from 'react';
import {isNotEmpty} from "../../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function CircleProgressBar(props) {
    const {percent, textColor = null, ringColor = null, seconds = null} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
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

    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'progress_bars',
        templateId: 'circleProgressBar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            textStyle,
            ringColorStyle,
            animationStyle,
            degStyle,
            ...props
        }
    })
}

export default CircleProgressBar;
