import React, {useState} from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import {CustomDropdownToggle} from "../dropdown/CustomDropdown";
import DropdownMenuList from "./DropdownMenuList";
import UserAccountLoader from "../loaders/UserAccountLoader";
import {connect} from "react-redux";
import {getPageDataMiddleware} from "../../redux/middleware/page-middleware";
import {isNotEmpty, isObjectEmpty} from "../../library/utils";
import {setModalContentAction} from "../../redux/actions/page-actions";
import {componentsConfig} from "../../../config/components-config";
import {siteConfig} from "../../../config/site-config";

const ProfileMenu = ({data, siteSettings}) => {
    const [userData, setUserData] = useState({});
    return (
        <>
            {isObjectEmpty(userData) &&
            <div className={"d-flex justify-content-end"}>
                <div className="phone_num d-none d-xl-block">
                    <a
                        className={"text-white"}
                        onClick={() => {
                            setModalContentAction(componentsConfig.components.authentication_login.name, {}, true)
                        }}
                    >
                        {!siteSettings?.profile_menu_login_text ? siteConfig.defaultProfileMenuLoginText : siteSettings.profile_menu_login_text}
                    </a>
                </div>
                <div className="phone_num d-none d-xl-block ml-2">
                    <a
                        className={"text-white"}
                        onClick={() => {
                            setModalContentAction(componentsConfig.components.authentication_register.name, {}, true)
                        }}
                    >
                        {!siteSettings?.profile_menu_register_text ? siteConfig.defaultProfileMenuRegisterText : siteSettings.profile_menu_register_text}
                    </a>
                </div>
            </div>
            }

            <UserAccountLoader
                dataCallback={setUserData}
                fields={[
                    {
                        form_control: "image_upload",
                        name: "profile_picture"
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
                        name: "user_email"
                    },
                ]}
            >
                <div className="profile-menu">
                    <Dropdown drop={"down"} alignRight={true}>
                        <Dropdown.Toggle as={CustomDropdownToggle} id="dropdown-custom-components">
                            <div className={"d-flex align-items-center justify-content-end"}>
                                    <span
                                        className="mr-2 d-none d-lg-inline text-gray-600 small">{userData?.user_email}</span>
                                <img
                                    className="profile-user-img img-fluid img-circle"
                                    src={isNotEmpty(userData?.profile_picture)? userData.profile_picture : "https://via.placeholder.com/150"}
                                    alt="User profile picture"
                                />
                            </div>
                        </Dropdown.Toggle>
                        <DropdownMenuList data={data} sessionLinks={true} />
                    </Dropdown>
                </div>
            </UserAccountLoader>
        </>
    )
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
    };
}

export default connect(
    mapStateToProps,
    null
)(ProfileMenu);
