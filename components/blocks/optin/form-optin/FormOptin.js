import React from 'react';
import FormBlock from "../../form/FormBlock";
import HtmlParser from "react-html-parser";
import SpeechBubbleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/SpeechBubbleTestimonialsCarousel";

const FormOptin = ({data}) => {
    console.log(data.carousel)
    return (
        <div className="section_gap registration_area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="row clock_sec clockdiv" id="clockdiv">
                            <div className="col-lg-12">
                                <h1 className="mb-3">{data?.heading}</h1>
                                <>{HtmlParser(data?.text)}</>
                                {data?.show_carousel &&
                                <SpeechBubbleTestimonialsCarousel data={data.carousel.carousel_data} />
                                }
                            </div>
                            {/*<div className="col clockinner1 clockinner">*/}
                            {/*    <h1 className="days">150</h1>*/}
                            {/*    <span className="smalltext">Days</span>*/}
                            {/*</div>*/}
                            {/*<div className="col clockinner clockinner1">*/}
                            {/*    <h1 className="hours">23</h1>*/}
                            {/*    <span className="smalltext">Hours</span>*/}
                            {/*</div>*/}
                            {/*<div className="col clockinner clockinner1">*/}
                            {/*    <h1 className="minutes">47</h1>*/}
                            {/*    <span className="smalltext">Mins</span>*/}
                            {/*</div>*/}
                            {/*<div className="col clockinner clockinner1">*/}
                            {/*    <h1 className="seconds">59</h1>*/}
                            {/*    <span className="smalltext">Secs</span>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="col-lg-4 offset-lg-1">
                        <div className="register_form">
                            <FormBlock data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormOptin;
