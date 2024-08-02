import React, {useContext, useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";
import UserProfileEditWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileEditWidget";
import UserProfileDisplayWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileDisplayWidget";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function UserProfileWidget({data}) {

    const templateManager = new TemplateManager(useContext(TemplateContext));

    function getProfileComponent() {
        switch (data?.view) {
            case 'edit':
                return templateManager.render(<UserProfileEditWidget data={data}/>);
            default:
                return templateManager.render(<UserProfileDisplayWidget data={data}/>);
        }
    }

    return templateManager.render(
        <div className="featured-tab color-blue">
            <h3 className="block-title"><span>{data?.heading || 'Profile'}</span></h3>
            <div className="card-body">
                {getProfileComponent()}
            </div>
        </div>
    );
}

UserProfileWidget.category = 'account';
UserProfileWidget.templateId = 'userProfileWidget';
export default UserProfileWidget;
