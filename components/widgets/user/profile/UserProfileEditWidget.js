import React, {useContext, useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";

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

    function renderWidget() {
        return templateManager.render(<h1>Edit profile</h1>);
    }

    return (
        <>
            {data?.access_control === 'protected'
                ? (
                    <UserAccountLoader
                        fields={UserAccountHelpers.getFields()}
                    >
                        {renderWidget()}
                    </UserAccountLoader>
                )
                : renderWidget()
            }
        </>
    );
}

UserProfileEditWidget.category = 'account';
UserProfileEditWidget.templateId = 'userProfileEditWidget';
export default UserProfileEditWidget;
