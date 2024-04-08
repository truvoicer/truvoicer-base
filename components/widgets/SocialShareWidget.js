import React, {useContext} from 'react';
import {fB} from "caniuse-lite/data/browserVersions";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";

function SocialShareWidget({href}) {
    const fbContext = useContext(FbAuthContext);
    function fbClickHandler(e) {
        e.preventDefault();
        console.log('fbContext', fbContext)
        fbContext.fb.ui({
            method: 'share',
            href: href,
        });
    }
    return (
        <div className="share-items clearfix">
            <ul className="post-social-icons unstyled">
                <li className="facebook">
                    <a href="#" onClick={fbClickHandler}>
                        <i className="fa fa-facebook"></i> <span
                        className="ts-social-title">Facebook</span></a>
                </li>
                <li className="twitter">
                    <a href="#">
                        <i className="fa fa-twitter"></i> <span
                        className="ts-social-title">Twitter</span></a>
                </li>
                <li className="pinterest">
                    <a href="#">
                        <i className="fa fa-pinterest"></i> <span
                        className="ts-social-title">Pinterest</span></a>
                </li>
            </ul>
        </div>
    );
}
SocialShareWidget.category = 'widgets';
SocialShareWidget.templateId = 'socialShareWidget';
export default SocialShareWidget;
