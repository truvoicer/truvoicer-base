import React from 'react';
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faPinterest, faTiktok, faTwitter} from "@fortawesome/free-brands-svg-icons";

function SocialFollowWidget({siteSettings}) {
    return (
        <ul className="social-icon">
            {siteSettings?.facebook_follow_url && (
                <li>
                    <a href={siteSettings.facebook_follow_url} target="_blank">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                </li>
            )}
            {siteSettings?.x_follow_url && (
                <li>
                    <a href={siteSettings.x_follow_url} target="_blank">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                </li>
            )}
            {siteSettings?.pinterest_follow_url && (
                <li>
                    <a href={siteSettings.pinterest_follow_url} target="_blank">
                        <FontAwesomeIcon icon={faPinterest} />
                    </a>
                </li>
            )}
            {siteSettings?.tiktok_follow_url && (
                <li>
                    <a href={siteSettings.tiktok_follow_url} target="_blank">
                        <FontAwesomeIcon icon={faTiktok} />
                    </a>
                </li>
            )}
        </ul>
    );
}

SocialFollowWidget.category = 'widgets';
SocialFollowWidget.templateId = 'socialFollowWidget';
function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
    };
}

export default connect(
    mapStateToProps,
    null
)(SocialFollowWidget);
