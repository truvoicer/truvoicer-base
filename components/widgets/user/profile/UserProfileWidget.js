import React, {useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";
import UserProfileEditWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileEditWidget";
import UserProfileDisplayWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileDisplayWidget";

function UserProfileWidget({data}) {

    function getProfileComponent() {
        switch (data?.view) {
            case 'edit':
                return <UserProfileEditWidget data={data} />;
            default:
                return <UserProfileDisplayWidget data={data} />;
        }
    }
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

export default UserProfileWidget;
