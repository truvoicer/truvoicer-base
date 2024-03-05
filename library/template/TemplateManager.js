import {isComponentFunction} from "@/truvoicer-base/library/utils";
import {buildComponent} from "@/truvoicer-base/library/helpers/component-helpers";
import Paginate from "@/truvoicer-base/components/blocks/listings/pagination/ListingsPaginate";
import React from "react";
import FullWidthTemplate from "@/truvoicer-base/components/templates/FullWidthTemplate";
import SidebarTemplate from "@/truvoicer-base/components/templates/SidebarTemplate";

export class TemplateManager {
    constructor(templateContext) {
        if (typeof templateContext !== 'undefined' && templateContext !== null) {
            this.setTemplateContext(templateContext);
        }
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

    getPostTemplateLayoutComponent(pageData) {
        if (!pageData?.post_type) {
            return <FullWidthTemplate />;
        }
        switch (pageData?.post_type) {
            case 'page':
                return this.getTemplateLayoutComponent(pageData?.page_options?.trf_gut_pmf_page_options_page_template);
            case 'post':
            default:
                return <FullWidthTemplate />;
        }
    }
    getTemplateLayoutComponent(templateLayout) {
        switch (templateLayout) {
            case 'left-sidebar':
            case 'right-sidebar':
                return <SidebarTemplate />;
            case 'full-width':
            default:
                return <FullWidthTemplate />;
        }
    }

    isTemplateLayout(pageData, templateLayout) {
        return (pageData?.page_options?.trf_gut_pmf_page_options_page_template === templateLayout);
    }
}
