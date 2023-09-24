import React, {useContext} from 'react';
import FormOptin from "./form-optin/FormOptin";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const OptinBlock = (props) => {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getOptin = (data) => {
        switch (data?.optin_type) {
            case "form":
                return <FormOptin data={data} />
            default:
                return null;
        }
    }
    function defaultView() {
        return (
            <>
                {getOptin(data)}
            </>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'optinBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getOptin: getOptin,
            ...props
        }
    })
}

export default OptinBlock;
