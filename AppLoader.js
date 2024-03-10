import React, {useContext, useState} from 'react';
import {AppContext, appContextData} from "@/truvoicer-base/config/contexts/AppContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {TemplateContext, templateData} from "@/truvoicer-base/config/contexts/TemplateContext";
import {GoogleAuthContext} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import {FbAuthContext} from "@/truvoicer-base/config/contexts/FacebookAuthContext";
import {connect} from "react-redux";
import {sessionContextData} from "@/truvoicer-base/config/contexts/SessionContext";
import SessionLayout from "@/truvoicer-base/components/layout/SessionLayout";

const AppLoader = ({templateConfig = {}, children}) => {

    const [appContextState, setAppContextState] = useState({
        ...appContextData,
        ...{
            updateAppContexts: ({key, value}) => {
                updateStateNestedObjectData({
                    object: 'contexts',
                    key,
                    value,
                    setStateObj: setAppContextState
                })
            },
            updateData: ({key, value}) => {
                updateStateObject({
                    key,
                    value,
                    setStateObj: setAppContextState
                })
            },
        }
    })

    const [templateContextState, setTemplateContextState] = useState({
        ...templateData,
        ...templateConfig,
        updateByTemplateCategory: ({category, key, value}) => {
            updateStateNestedObjectData({
                object: category,
                key,
                value,
                setStateObj: setTemplateContextState
            })
        },
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setTemplateContextState
            })
        },
    })
    return (
            <AppContext.Provider value={appContextState}>
                <TemplateContext.Provider value={templateContextState}>
                    {children}
                </TemplateContext.Provider>
            </AppContext.Provider>
    );
};
export default AppLoader;
