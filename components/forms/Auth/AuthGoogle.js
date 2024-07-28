import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {GoogleAuthContext} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import SocialButton from "@/truvoicer-base/components/forms/Buttons/SocialButton";

const AuthGoogle = (props) => {
    const gAuthContext = useContext(GoogleAuthContext);

    const onClickHandler = (response) => {
        gAuthContext.google.accounts.id.prompt((notification) => {

        });
    }
    useEffect(() => {
    }, [gAuthContext.google]);

    return (
        <SocialButton buttonClass={props?.buttonClass || ''}
                      iconClass={<FontAwesomeIcon icon={faGoogle}/>}
                      buttonLabel={props.buttonLabel}
                      onClick={onClickHandler}
                      id={'google'}
        />
    );
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings
    };
}

AuthGoogle.category = 'auth';
AuthGoogle.templateId = 'authGoogle';
export default connect(
    mapStateToProps,
    null
)(AuthGoogle);
