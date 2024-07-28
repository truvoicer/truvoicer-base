import React, {useContext} from 'react';
import {fB} from "caniuse-lite/data/browserVersions";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";
import {TwitterContext} from "@/truvoicer-base/config/contexts/TwitterContext";
import {PinterestContext} from "@/truvoicer-base/config/contexts/PinterestContext";
import {faFacebook, faPinterest, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function SocialShareWidget({href, text}) {
    const fbContext = useContext(FbAuthContext);
    const twitterContext = useContext(TwitterContext);
    const pinterestContext = useContext(PinterestContext);
    function fbClickHandler(e) {
        e.preventDefault();
        fbContext.fb.ui({
            method: 'share',
            href: href,
        });
    }
    function twitterClickHandler(e) {
        twitterContext.handleIntent(e);
    }
    function pinterestClickHandler(e) {
        e.preventDefault();
        // pinterestContext.pin();
    }
    function buildTwitterUrl() {
        const url = new URL('https://twitter.com/intent/tweet');
        url.searchParams.append('url', href);
        url.searchParams.append('text', text);
        return url.toString();
    }
    return (
        <div className="share-items clearfix">
            <ul className="post-social-icons unstyled">
                <li className="facebook">
                    <a href="#" onClick={fbClickHandler}>
                        <FontAwesomeIcon icon={faFacebook} /> <span
                        className="ts-social-title">Facebook</span></a>
                </li>
                <li className="twitter">
                    <a href={buildTwitterUrl()} onClick={twitterClickHandler}>
                        <FontAwesomeIcon icon={faTwitter} /> <span
                        className="ts-social-title">Twitter</span></a>
                </li>
                <li className="pinterest">
                    <a href="#" onClick={pinterestClickHandler}>
                        <FontAwesomeIcon icon={faPinterest} /> <span
                        className="ts-social-title">Pinterest</span></a>
                </li>
            </ul>
        </div>
    );
}
SocialShareWidget.category = 'widgets';
SocialShareWidget.templateId = 'socialShareWidget';
export default SocialShareWidget;
