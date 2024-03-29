import React, {useContext} from 'react';
import FormBlock from "../../../blocks/form/FormBlock";
import {isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function CvForm(props) {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!isObject(props?.data?.form_block)) {
        return null;
    }

    return (
        <>
            {templateManager.render(<FormBlock data={props.data.form_block}/>)}
        </>
    );
}
CvForm.category = 'profile_forms';
CvForm.templateId = 'cvForm';
export default CvForm;
