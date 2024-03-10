import React, {useContext} from 'react';
import FormBlock from "../../form/FormBlock";
import HtmlParser from "react-html-parser";
import SpeechBubbleTestimonialsCarousel
    from "@/truvoicer-base/components/blocks/carousel/types/Testimonials/SpeechBubbleTestimonialsCarousel";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {isFunction} from "underscore";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/items";
import {isObject} from "@/truvoicer-base/library/utils";
import CarouselInterface from "@/truvoicer-base/components/blocks/carousel/CarouselInterface";

const FormOptin = (props) => {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    //console.log(data.carousel)
    function defaultView() {
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
                                        <CarouselInterface data={data?.carousel_block}/>
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
                                {data?.form_block &&
                                    <FormBlock data={data.form_block}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'formOptin',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}

export default FormOptin;
