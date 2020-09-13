import store from "../store"
import { setSidebarData, setTopBarData, setFooterData, setPageError } from "../reducers/page-reducer"
import React from "react";
import {FOOTER_REQUEST, SIDEBAR_REQUEST, TOPBAR_REQUEST} from "../constants/sidebar-constants";
import {setSidebarAction} from "../actions/sidebar-actions";

export function getSidebarData(url, sidebarRequest) {
    return function(dispatch) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(json => {
                setSidebarAction(json, sidebarRequest)
            })
            .catch(error => {
                console.error(error)
                dispatch(setPageError(error.message))
            });
    };
}