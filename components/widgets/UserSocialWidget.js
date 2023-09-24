import React, {useContext, useState} from 'react';
import Link from "next/link";
import {siteConfig} from "../../../config/site-config";
import {formatDate, isNotEmpty} from "../../library/utils";
import UserAccountLoader from "../loaders/UserAccountLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function UserSocialWidget(props) {
    const {data} = props;
    const [userData, setUserData] = useState({});
    const fields = [
        {
            form_control: "image_upload",
            name: "profile_picture"
        },
        {
            form_control: "email",
            name: "user_email"
        },
        {
            form_control: "text",
            name: "display_name"
        },
        {
            form_control: "text",
            name: "first_name"
        },
        {
            form_control: "text",
            name: "surname"
        },
        {
            form_control: "text",
            name: "telephone"
        },
        {
            form_control: "text",
            name: "user_registered"
        },
        {
            form_control: "saved_item_count",
            name: "saved_jobs_count"
        }
    ];
    const templateManager = new TemplateManager(useContext(TemplateContext));
    // console.log({userData})
    function defaultView() {
        return (
            <UserAccountLoader
                dataCallback={setUserData}
                fields={fields}
            >
                <div className="card card-primary card-outline">
                    <div className="card-body box-profile">
                        <div className="text-center">
                            <img
                                className="profile-user-img img-fluid img-circle"
                                src={isNotEmpty(userData?.profile_picture) ? userData.profile_picture : "https://via.placeholder.com/150"}
                                alt="User profile picture"
                            />
                        </div>

                        <h3 className="profile-username text-center">{userData?.first_name} {userData?.surname}</h3>

                        <p className="text-muted text-center">{userData?.user_email}</p>

                        <ul className="list-group list-group-unbordered mb-3">
                            <li className="list-group-item">
                                <b>Saved Jobs</b>
                                <a className="float-right">
                                    {isNotEmpty(userData?.saved_jobs_count) ? parseInt(userData?.saved_jobs_count) : ""}
                                </a>
                            </li>
                            <li className="list-group-item">
                                <b>Date Joined</b>
                                <a className="float-right">{formatDate(userData?.user_registered)}</a>
                            </li>
                        </ul>
                        <Link href={siteConfig.defaultUserAccountHref + "/profile"}
                              className="btn btn-primary btn-block"><b>{data?.button_label || 'Edit Profile'}</b>
                        </Link>
                    </div>
                </div>
            </UserAccountLoader>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'account',
        templateId: 'userSocialWidget',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}

export default UserSocialWidget;
