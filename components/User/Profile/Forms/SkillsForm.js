import React, {useContext} from 'react';
import FormBlock from "../../../blocks/form/FormBlock";
import {isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function SkillsForm(props) {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    if (!isObject(props?.data?.form_block)) {
        return null;
    }
    function defaultView() {
    return (
        <>
            <FormBlock data={props.data.form_block} />
        </>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'profile_forms',
        templateId: 'skillsForm',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}

export default SkillsForm;
