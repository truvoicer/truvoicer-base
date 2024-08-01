import {isComponentFunction, isNotEmpty} from "@/truvoicer-base/library/utils";
import {buildComponent} from "@/truvoicer-base/library/helpers/component-helpers";
import React from "react";
import FullWidthTemplate from "@/truvoicer-base/components/templates/FullWidthTemplate";
import SidebarTemplate from "@/truvoicer-base/components/templates/SidebarTemplate";
import {TemplateConfig} from "@/truvoicer-base/library/template/config/TemplateConfig";

export class TemplateManager {
    constructor(templateContext) {
        if (typeof templateContext !== 'undefined' && templateContext !== null) {
            this.setTemplateContext(templateContext);
        }
    }

    getTemplateConfig() {

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
    hasTemplateComponent(category = null, templateId = null) {
        return !!isComponentFunction(this.templateContext?.[category]?.[templateId]);
    }

    renderConnectFunctionComponent({defaultComponent, category, templateId, props = {}}) {
        const TemplateComponent = buildComponent(
            this.getTemplateComponentFromContext(
                category,
                templateId
            ),
            props
        )

        if (!TemplateComponent) {
            const Component = buildComponent(defaultComponent, props);
            return <Component {...props} />;
        }
        return <TemplateComponent {...props} />;
    }
    render(component, props = {}) {
        if (component?.type?.name === 'ConnectFunction' &&
            component?.WrappedComponent?.category &&
            component?.WrappedComponent?.templateId
        ) {
            return this.renderConnectFunctionComponent({
                defaultComponent: component,
                category: component.WrappedComponent.category,
                templateId: component.WrappedComponent.templateId,
                props
            });
        }
        if (
            typeof component?.$$typeof === 'symbol' &&
            component.$$typeof.toString() === 'Symbol(react.element)' &&
            component.type.category &&
            component.type.templateId
        ) {
            return this.getTemplateComponent({
                category: component.type.category,
                templateId: component.type.templateId,
                defaultComponent: component,
                props
            });
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
            return this.render(<FullWidthTemplate />);
        }
        switch (pageData?.post_type) {
            case 'page':
            case 'trf_post_tpl':
            case 'trf_item_view_tpl':
                return this.getTemplateLayoutComponent(pageData?.page_options?.trf_gut_pmf_page_options_layout);
            case 'post':
            default:
                return this.render(<FullWidthTemplate />);
        }
    }
    getTemplateLayoutComponent(templateLayout) {
        switch (templateLayout) {
            case 'sidebar':
                return this.render(<SidebarTemplate />);
            case 'full-width':
            default:
                return this.render(<FullWidthTemplate />);
        }
    }

    isSidebar(pageData, sidebar) {
        return (pageData?.page_options?.trf_gut_pmf_page_options_sidebar === sidebar);
    }

     showSidebar(pageData, layout, sidebar) {
        if (isNotEmpty(sidebar)) {
            return false;
        }
        return pageData?.page_options?.trf_gut_pmf_page_options_sidebar_position === layout
    }

    getHorizontalSidebarName(pageData, sidebar) {
        switch (pageData?.page_options?.trf_gut_pmf_page_options_sidebar_position) {
            case 'top':
                return pageData?.page_options?.trf_gut_pmf_page_options_sidebar;
            case 'bottom':
                return pageData?.page_options?.trf_gut_pmf_page_options_sidebar;
            default:
                return sidebar
        }
    }
}
