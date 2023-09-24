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
                return <UserProfileEditWidget data={data} />;
            default:
                return <UserProfileDisplayWidget data={data} />;
        }
    }
    function defaultView() {
        return (
            <UserAccountLoader>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title text-white">{data?.heading}</h3>
                    </div>
                    <div className="card-body">
                        {getProfileComponent()}
                    </div>
                </div>
            </UserAccountLoader>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'userProfileWidget',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getProfileComponent: getProfileComponent,
        }
    })
}

export default UserProfileWidget;
