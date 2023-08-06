import React, {useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";

function UserProfileEditWidget({data}) {
    const [userData, setUserData] = useState({});
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
        <UserAccountLoader
            fields={fields}
            dataCallback={setUserData}
        >
              <h1>Edit profile</h1>
        </UserAccountLoader>
    );
}

export default UserProfileEditWidget;
