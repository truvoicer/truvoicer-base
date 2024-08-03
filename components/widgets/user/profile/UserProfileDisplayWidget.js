import React, {useContext, useState} from 'react';
import WpDataLoader from "../../../loaders/WpDataLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faArrowCircleRight, faFile, faMapMarkedAlt, faPencil} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";
import ComponentLoader from "@/truvoicer-base/components/loaders/ComponentLoader";

function UserProfileDisplayWidget(props) {
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


    return templateManager.render(
        <ComponentLoader
            selfAccessControl={data?.access_control}
            parentAccessControl={parentAccessControl}>
            <strong><FontAwesomeIcon icon={faMapMarkedAlt} className="mr-1"/> Location</strong>
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
            <strong><FontAwesomeIcon icon={faPencil} className="mr-1"/> Skills</strong>
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
            <strong><FontAwesomeIcon icon={faPencil} className="mr-1"/> About Me</strong>
            <p className="text-muted">
                {!userData?.short_description
                    ?
                    <>{fieldEmptyMessage("short description")}</>
                    :
                    <>{userData?.short_description}</>
                }
            </p>
            <hr/>
            <strong><FontAwesomeIcon icon={faFile} className="mr-1"/> Personal Statement</strong>
            <p className="text-muted">
                {!userData?.personal_statement
                    ?
                    <>{fieldEmptyMessage("personal statement")}</>
                    :
                    <>{userData?.personal_statement}</>
                }
            </p>
        </ComponentLoader>
    );
}

UserProfileDisplayWidget.category = 'account';
UserProfileDisplayWidget.templateId = 'userProfileDisplayWidget';
export default UserProfileDisplayWidget;
