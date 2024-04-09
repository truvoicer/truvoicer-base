import React, {useContext, useEffect, useState} from 'react';
import {AppContext, appContextData} from "@/truvoicer-base/config/contexts/AppContext";
import {updateStateNestedObjectData, updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";
import {TemplateContext, templateData} from "@/truvoicer-base/config/contexts/TemplateContext";
import SessionLayout from "@/truvoicer-base/components/layout/SessionLayout";
import GoogleAuthProvider from "@/truvoicer-base/components/providers/GoogleAuthProvider";
import FBAuthProvider from "@/truvoicer-base/components/providers/FBAuthProvider";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {AppModalContext, appModalContextData} from "@/truvoicer-base/config/contexts/AppModalContext";
import {useRouter} from "next/navigation";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {isNotEmpty, isSet} from "@/truvoicer-base/library/utils";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";
import {LoadEnvironment} from "@/truvoicer-base/library/api/global-scripts";
import {validateToken} from "@/truvoicer-base/redux/actions/session-actions";
import TwitterProvider from "@/truvoicer-base/components/providers/TwitterProvider";
import PinterestProvider from "@/truvoicer-base/components/providers/PinterestProvider";

const AppLoader = ({templateConfig = {}, page}) => {

    const router = useRouter();
    const templateContext = useContext(TemplateContext);
    const templateManager = new TemplateManager(templateContext);

    function getWidget(component, data) {
        if (isSet(blockComponentsConfig.components[component]) && isSet(blockComponentsConfig.components[component].component)) {
            const ModalContent = blockComponentsConfig.components[component].component;
            return <ModalContent data={data}/>;
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
    useEffect(() => {
        LoadEnvironment();
        validateToken();
        console.log("AppLoader useEffect")
    }, [])
    return (
        <AppContext.Provider value={appContextState}>
            <TemplateContext.Provider value={templateContextState}>
                <AppModalContext.Provider value={modalState}>
                    <GoogleAuthProvider>
                        <FBAuthProvider>
                            <TwitterProvider>
                                <PinterestProvider>
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
                                </PinterestProvider>
                            </TwitterProvider>
                        </FBAuthProvider>
                    </GoogleAuthProvider>
                </AppModalContext.Provider>
            </TemplateContext.Provider>
        </AppContext.Provider>
    );
};
export default AppLoader;
