import React, {useContext, useEffect} from "react";
import {connect} from "react-redux";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {GoogleAuthContext} from "@/truvoicer-base/config/contexts/GoogleAuthContext";

const AuthGoogle = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const gAuthContext = useContext(GoogleAuthContext);

    const onClickHandler = (response) => {
        //console.log({response});
    }
    useEffect(() => {
        gAuthContext.google.accounts.id.renderButton(document.getElementById("g-signin2"), {
            theme: 'outline',
            size: 'large',
            click_listener: onClickHandler
        });
    }, []);

    function defaultView() {
        return (
            <div id="g-signin2"></div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'auth',
        templateId: 'authGoogle',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings
    };
}
export default connect(
    mapStateToProps,
    null
)(AuthGoogle);
