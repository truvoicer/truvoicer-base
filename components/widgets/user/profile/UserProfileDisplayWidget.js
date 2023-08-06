import React, {useState} from 'react';
import UserAccountLoader from "../../../loaders/UserAccountLoader";

function UserProfileDisplayWidget({data}) {
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
            <strong><i className="fas fa-map-marker-alt mr-1"/> Location</strong>
            <p className="text-muted">
                {!userData?.country?.label && !userData?.town
                    ?
                        <>{fieldEmptyMessage("location")}</>
                    :
                    <>
                        {userData?.country?.label ? userData?.country?.label : ""}
                        {userData?.town ? ", " + userData?.town : ""}
                    </>
                }

            </p>
            <hr/>
            <strong><i className="fas fa-pencil-alt mr-1"/> Skills</strong>
            <p className="text-muted">
                {!Array.isArray(userData?.skills) || userData?.skills.length === 0
                    ?
                    <>{fieldEmptyMessage("skills")}</>
                    :
                    <>
                    {Array.isArray(userData?.skills) && userData?.skills.map((skill, index) => (
                        `${skill.label}${index < (userData.skills.length - 1) ? ", " : ""}`
                    ))}
                    </>
                }
            </p>
            <hr/>
            <strong><i className="fas fa-pencil-alt mr-1"/> About Me</strong>
            <p className="text-muted">
                {!userData?.short_description
                    ?
                    <>{fieldEmptyMessage("short description")}</>
                    :
                    <>{userData?.short_description}</>
                }
            </p>
            <hr/>
            <strong><i className="far fa-file-alt mr-1"/> Personal Statement</strong>
            <p className="text-muted">
                {!userData?.personal_statement
                    ?
                    <>{fieldEmptyMessage("personal statement")}</>
                    :
                    <>{userData?.personal_statement}</>
                }
            </p>
        </UserAccountLoader>
    );
}

export default UserProfileDisplayWidget;
