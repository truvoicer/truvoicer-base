import React, {useContext} from 'react';
import FormBlock from "../../form/FormBlock";
import parse from 'html-react-parser';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import CarouselInterface from "@/truvoicer-base/components/blocks/carousel/CarouselInterface";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const FormOptin = (props) => {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (
        <div className="ts-newsletter">
            <div className="newsletter-introtext">
                <h4>{data?.heading || 'Get Updates'}</h4>
                <p>{data?.description || 'Subscribe our newsletter to get the best stories into your inbox!'}</p>
            </div>

            <div className="newsletter-form">
                {isNotEmpty(data?.form_block) && (
                    templateManager.render(<FormBlock data={data.form_block}/>)
                )}
            </div>
        </div>
    );
}

FormOptin.category = 'public';
FormOptin.templateId = 'formOptin';

export default FormOptin;
