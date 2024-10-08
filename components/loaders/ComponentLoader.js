import React, {useContext} from 'react';
import WpDataLoader from "@/truvoicer-base/components/loaders/WpDataLoader";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import WpDataLoaderDataContext from "@/truvoicer-base/components/loaders/contexts/WpDataLoaderDataContext";
import UserSocialWidget from "@/truvoicer-base/components/widgets/UserSocialWidget";

function ComponentLoader({
    children,
    selfAccessControl = null,
    parentAccessControl = null
}) {

    return (
        <>
            {!isNotEmpty(parentAccessControl)
                ? (
                    <WpDataLoader
                        fields={UserAccountHelpers.getFields()}
                    >
                        {children}
                    </WpDataLoader>
                )
                : children
            }
        </>
    );
}

ComponentLoader.category = 'loaders';
ComponentLoader.templateId = 'componentLoader';
export default ComponentLoader;
