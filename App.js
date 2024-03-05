import {
    AddAxiosInterceptors,
    initializeTagManager,
    LoadEnvironment,
    tagManagerSendDataLayer
} from "@/truvoicer-base/library/api/global-scripts";
import Script from 'next/script'
import React, {useContext, useEffect, useState} from "react";
import {validateToken} from "@/truvoicer-base/redux/actions/session-actions";
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
import {getWidget} from "@/truvoicer-base/redux/actions/page-actions";
import {GoogleAuthContext, googleAuthContextData} from "@/truvoicer-base/config/contexts/GoogleAuthContext";
import GoogleAuthProvider from "@/truvoicer-base/components/providers/GoogleAuthProvider";
import FBAuthProvider from "@/truvoicer-base/components/providers/FBAuthProvider";

const FetcherApp = ({
    pageData, siteSettings, pageOptions, preFetch = () => {
    }
}) => {
    const router = useRouter();
    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);

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
        AddAxiosInterceptors();
        LoadEnvironment();
        validateToken();
    }, [])

    useEffect(() => {
        if (typeof preFetch === "function") {
            preFetch()
        }
    }, [])

    useEffect(() => {
        if (!isObjectEmpty(pageData)) {
            // tagManagerSendDataLayer({
            //     dataLayerName: "pageView",
            //     dataLayer: {
            //         page: router.asPath
            //     }
            // })

        }
    }, [router.asPath])


    console.log({pageOptions, pageData})
    return (
        <AppLoader templateConfig={templateConfig()}>
            <AppModalContext.Provider value={modalState}>
                <GoogleAuthProvider>
                    <FBAuthProvider>
                        {templateManager.getPostTemplateLayoutComponent(pageData)}
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
                    </FBAuthProvider>
                </GoogleAuthProvider>
            </AppModalContext.Provider>
        </AppLoader>
    )
}

function mapStateToProps(state) {
    return {
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
        pageOptions: state.page.pageDataOptions,
        modal: state.page.modal
    };
}

export default connect(
    mapStateToProps,
    null
)(FetcherApp);
