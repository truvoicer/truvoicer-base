import React, {useContext} from 'react';
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import ListingsFilter from "@/truvoicer-base/components/blocks/listings/filters/ListingsFilter";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterInterface = ({pageSidebar = false}) => {
    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const fetchListingsContextGroups = appManager.findContextGroupsByContextId("listingsContext");

    return (
        <>
            {fetchListingsContextGroups.map((listingsContextGroup, index) => {
                if (
                    !listingsContextGroup.listingsContext?.listingsData?.show_filters &&
                    !listingsContextGroup.listingsContext?.listingsData?.show_filters_in_sidebar
                ) {
                    return null;
                }
                return templateManager.render(<ListingsFilter key={index} listingsContextGroup={listingsContextGroup} />)
            })}
        </>
    );
};
ListingsFilterInterface.category = 'sidebar';
ListingsFilterInterface.templateId = 'listingsFilterInterface';
export default ListingsFilterInterface;
