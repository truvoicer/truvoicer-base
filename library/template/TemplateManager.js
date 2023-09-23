import {isComponentFunction} from "@/truvoicer-base/library/utils";
import {buildComponent} from "@/truvoicer-base/library/helpers/component-helpers";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import React from "react";

export class TemplateManager {
    constructor(templateContext) {
        this.setTemplateContext(templateContext);
    }

    getTemplateContext() {
        return this.templateContext;
    }
    setTemplateContext(templateContext) {
        this.templateContext = templateContext;
    }
    updateContext({key, value}) {
        this.templateContext.updateData({key, value})
    }

    updateContextsByCategory({category, key, value}) {
        this.templateContext.updateByTemplateCategory({category, key, value})
    }

    getTemplateComponentFromContext(category, templateId) {
        if (isComponentFunction(this.templateContext?.[category]?.[templateId])) {
            return this.templateContext[category][templateId]
        }
        return null;
    }
    getTemplateComponent({category = null, templateId = null, defaultComponent = null, props = {}}) {
        const TemplateComponent = buildComponent(
            this.getTemplateComponentFromContext(
                category,
                templateId
            ),
            props
        )
        if (!TemplateComponent) {
            return defaultComponent;
        }
        return <TemplateComponent {...props} />;

    }

}
