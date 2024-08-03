import React, {useContext, useState} from 'react';
import WpDataLoader from "../../../loaders/WpDataLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";
import ComponentLoader from "@/truvoicer-base/components/loaders/ComponentLoader";

function UserProfileEditWidget(props) {
    const {data, parentAccessControl} = props;
    const [userData, setUserData] = useState({});
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const fields = [
        {
            form_control: "select_data_source",
            name: "skills"
        },
        {
            form_control: "text",
            name: "short_description"
        },
        {
            form_control: "text",
            name: "personal_statement"
        },
        {
            form_control: "text",
            name: "town"
        },
        {
            form_control: "text",
            name: "country"
        }
    ];
    const fieldEmptyMessage = (fieldName) => {
        return `Not yet filled.`
    }

    return (
        <ComponentLoader
            selfAccessControl={data?.access_control}
            parentAccessControl={parentAccessControl}>
            {templateManager.render(<h1>Edit profile</h1>)}
        </ComponentLoader>
    );
}

UserProfileEditWidget.category = 'account';
UserProfileEditWidget.templateId = 'userProfileEditWidget';
export default UserProfileEditWidget;
