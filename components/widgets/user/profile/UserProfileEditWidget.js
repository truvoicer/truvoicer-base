import React, {useContext, useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function UserProfileEditWidget(props) {
    const {data} = props;
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

        return templateManager.render(
            <UserAccountLoader
                fields={fields}
                dataCallback={setUserData}
            >
                <h1>Edit profile</h1>
            </UserAccountLoader>
        );
}
UserProfileEditWidget.category = 'account';
UserProfileEditWidget.templateId = 'userProfileEditWidget';
export default UserProfileEditWidget;
