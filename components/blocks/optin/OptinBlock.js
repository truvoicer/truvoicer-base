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
                return templateManager.render(<FormOptin data={data} />);
            default:
                return null;
        }
    }

        return (
            <>
                {getOptin(data)}
            </>
        );
}
OptinBlock.category = 'public';
OptinBlock.templateId = 'optinBlock';
export default OptinBlock;
