'use client';
import {
    initializeTagManager,
    LoadEnvironment,
    tagManagerSendDataLayer
} from "@/truvoicer-base/library/api/global-scripts";
import React, {useContext, useEffect, useState} from "react";
import {
    setPasswordResetKeyAction,
    setSessionUserIdAction,
    validateToken
} from "@/truvoicer-base/redux/actions/session-actions";
import {connect} from "react-redux";
import {isNotEmpty, isObjectEmpty, isSet} from "@/truvoicer-base/library/utils";
import {useRouter} from "next/navigation";
import {TemplateContext, templateData} from "@/truvoicer-base/config/contexts/TemplateContext";
import AppLoader from "@/truvoicer-base/AppLoader";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {templateConfig} from "@/config/template-config";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {AppModalContext, appModalContextData} from "@/truvoicer-base/config/contexts/AppModalContext";
import {GoogleAuthContext, googleAuthContextData} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import GoogleAuthProvider from "@/truvoicer-base/components/providers/GoogleAuthProvider";
import FBAuthProvider from "@/truvoicer-base/components/providers/FBAuthProvider";
import SessionLayout from "@/truvoicer-base/components/layout/SessionLayout";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {loadBasePageData} from "@/truvoicer-base/redux/actions/page-actions";

const FetcherApp = ({
    page, settings, pageOptions = {}, isResetKey = false
}) => {
    const router = useRouter();
    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);
    function getWidget(component, data) {
        if (isSet(blockComponentsConfig.components[component]) && isSet(blockComponentsConfig.components[component].component)) {
            const ModalContent = blockComponentsConfig.components[component].component;
            return <ModalContent data={data} />;
        }
    }
    function updateModalState(data) {
        setModalState(modalState => {
            let cloneState = {...modalState};
            if (isNotEmpty(data?.component)) {
                if (typeof data.component === "string") {
                    cloneState.component = getWidget(data.component, data?.componentProps || {});
                } else if (typeof data.component === "function") {
                    cloneState.component = data.component;
                }
                delete data.component;
            }
            Object.keys(data).forEach((key) => {
                cloneState[key] = data[key];
            });
            return cloneState;
        })
    }

    function handleModalCancel() {
        if (typeof modalState?.onCancel === "function") {
            modalState.onCancel();
        }
        updateModalState({show: false});
    }

    const [modalState, setModalState] = useState({
        ...appModalContextData,
        showModal: updateModalState,
    });

    useEffect(() => {
        LoadEnvironment();
        validateToken();
    }, [])

    useEffect(() => {
        let basePageData = {
            page: page,
            settings: settings
        }
        if (!isObjectEmpty(pageOptions)) {
            basePageData.options = pageOptions;
        }
        loadBasePageData(basePageData);

        if (isResetKey) {
            setPasswordResetKeyAction(params.reset_key)
            setSessionUserIdAction(params.user_id)
        }
    }, [])

    return (
        <AppLoader templateConfig={templateConfig()}>
            <AppModalContext.Provider value={modalState}>
                <GoogleAuthProvider>
                    <FBAuthProvider>
                        <SessionLayout>
                            {templateManager.getPostTemplateLayoutComponent(page)}
                            <Modal show={modalState.show} onHide={handleModalCancel}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{modalState?.title || ''}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {modalState?.component || ''}
                                </Modal.Body>
                                {modalState?.showFooter &&
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleModalCancel}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleModalCancel}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                }
                            </Modal>
                        </SessionLayout>
                    </FBAuthProvider>
                </GoogleAuthProvider>
            </AppModalContext.Provider>
        </AppLoader>
    )
}


export default connect(
    null,
    null
)(FetcherApp);
