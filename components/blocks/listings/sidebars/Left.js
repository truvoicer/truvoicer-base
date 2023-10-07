import React, {useContext} from 'react';
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import ListingsFilter from "@/truvoicer-base/components/blocks/listings/filters/ListingsFilter";

const Left = () => {

    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const fetchListingsContextGroups = appManager.findContextGroupsByContextId("listingsContext");
    return (
        <>
            {fetchListingsContextGroups.map((listingsContextGroup, index) => {
                if (!listingsContextGroup.listingsContext?.listingsData?.show_filters_toggle) {
                    return null;
                }
                return <ListingsFilter key={index} listingsContextGroup={listingsContextGroup} />
            })}
        </>
    );
};

export default Left;
