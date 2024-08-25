import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import FormBlock from "@/truvoicer-base/components/blocks/form/FormBlock";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

const EmailOptinWidget = (props) => {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    return (

        <div className="ts-newsletter">
            <div className="newsletter-introtext">
                <h4>{data?.heading || 'Get Updates'}</h4>
                <p>{data?.description || 'Subscribe our newsletter to get the best stories into your inbox!'}</p>
            </div>

            <div className="newsletter-form">
                {isNotEmpty(data?.attrs?.form_block) && (
                    templateManager.render(<FormBlock data={data.attrs.form_block}/>)
                )}
            </div>
        </div>
    );
}
EmailOptinWidget.category = 'widgets';
EmailOptinWidget.templateId = 'emailOptinWidget';
export default EmailOptinWidget;
