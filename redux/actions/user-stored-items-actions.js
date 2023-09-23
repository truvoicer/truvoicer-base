import store from "../store";
import {
    SESSION_AUTHENTICATED,
} from "../constants/session-constants";
import {setModalContentAction} from "./page-actions";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";

const axios = require('axios');
const sprintf = require("sprintf").sprintf;

export function showAuthModal() {
    const authenticated = store.getState().session[SESSION_AUTHENTICATED];
    if (!authenticated) {
        setModalContentAction(
            blockComponentsConfig.components.authentication_login.name,
            {},
            true
        );
        return false;
    }
    return true;
}

