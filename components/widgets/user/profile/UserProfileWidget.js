import React, {useContext, useState} from 'react';
import WpDataLoader from "../../../loaders/WpDataLoader";
import UserProfileEditWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileEditWidget";
import UserProfileDisplayWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileDisplayWidget";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function UserProfileWidget(props) {
    const {data, parentAccessControl} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function getProfileComponent() {
        switch (data?.view) {
            case 'edit':
                return templateManager.render(<UserProfileEditWidget {...props}/>);
            default:
                return templateManager.render(<UserProfileDisplayWidget {...props}/>);
        }
    }

    return (
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
