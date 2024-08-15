import {isNotEmpty, isObject, isObjectEmpty, isSet} from "../../../library/utils";
import DataForm from "../../forms/DataForm/DataForm";
import React, {useContext, useEffect, useState} from "react";
import {protectedEndpoint, publicEndpoint, wpApiConfig} from "../../../config/wp-api-config";
import {connect} from "react-redux";
import {ChangePasswordFormFields} from "../../../config/forms/change-password-form-fields";
import {SESSION_AUTH_PROVIDER, SESSION_USER} from "../../../redux/constants/session-constants";
import WPErrorDisplay from "@/truvoicer-base/components/errors/WPErrorDisplay";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import {sprintf} from "sprintf-js";
import WpDataLoaderDataContext, {
    wpDataLoaderData
} from "@/truvoicer-base/components/loaders/contexts/WpDataLoaderDataContext";
import {FormHelpers} from "@/truvoicer-base/library/helpers/FormHelpers";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {REQUEST_GET, REQUEST_POST} from "@/truvoicer-base/library/constants/request-constants";
import {DataFormHelpers} from "@/truvoicer-base/components/forms/DataForm/Helpers/DataFormHelpers";

const FormBlock = (props) => {

    const wpDataLoaderContext = useContext(WpDataLoaderDataContext)
    const formHelpers = new FormHelpers();

    const templateManager = new TemplateManager(useContext(TemplateContext));

    const [response, setResponse] = useState({
        showAlert: false,
        error: false,
        success: false,
        message: ""
    })
    const [externalRequestData, setExternalRequestData] = useState({});
    const submitButtonText = "Update";
    const addListItemButtonText = "Add new item";

    const formData = props?.data;
    formHelpers.setValues(wpDataLoaderContext.data);

    const dataFormHelpers = new DataFormHelpers();
    dataFormHelpers.setContextData(wpDataLoaderContext?.data || {});
    dataFormHelpers.setExternalRequestData(externalRequestData);
    dataFormHelpers.setFormData(formData);


    const buildFormData = (formType) => {
        let configData = {
            fields: [],
            dataObject: {}
        };
        switch (formType) {
            case "single":
                configData.fields = buildSingleFormTypeData(formData?.form_rows);
                break;
            case "list":
                const dataObject = buildSingleFormTypeData(formData?.form_rows);
                configData.fields = dataObject;
                configData.dataObject = dataFormHelpers.buildListFields(
                    configData.fields || [],
                    {[formData.form_id]: wpDataLoaderContext?.data?.[formData?.form_id]}
                );
        }
        return configData;
    }

    function buildExternalRequestData() {
        let externalRequestDataObj = {};
        formRowsIterator({
            rows: formData?.form_rows,
            callback: async (item, itemIndex, rowIndex) => {
                const response = await dataFormHelpers.getExternalRequestFormFieldValue(item);
                if (!response) {
                    return;
                }
                externalRequestDataObj[item.name] = response;
            }
        });
        setExternalRequestData(externalRequestDataObj);
    }

    function formRowsIterator({rows, callback}) {
        rows.map((row, rowIndex) => {
            if (!Array.isArray(row?.form_items)) {
                return;
            }
            row.form_items.map((item, itemIndex) => {
                callback(item, itemIndex, rowIndex)
            })
        })
    }

    const buildSingleFormTypeData = (formRows) => {
        let configData = [];
        formRowsIterator({
            rows: formRows,
            callback: (item, itemIndex, rowIndex) => {
                let fieldConfig = dataFormHelpers.getFormFieldConfig(item);
                if (fieldConfig) {
                    fieldConfig.rowIndex = rowIndex;
                    fieldConfig.columnIndex = itemIndex;
                    configData.push(fieldConfig);
                }
            }
        });
        if (formData.endpoint === "account_details") {
            return [...configData, ...ChangePasswordFormFields()]
        }
        return configData;
    }

    function getEndpointUrlByType(endpoint) {
        const buildPublicEndpointUrl = `${publicEndpoint}/${endpoint}`;
        const buildProtectedEndpointUrl = `${protectedEndpoint}/${endpoint}`;
        switch (formData?.endpoint_type) {
            case "protected":
                return buildProtectedEndpointUrl;
            case "public":
            default:
                return buildPublicEndpointUrl;
        }
    }

    const getEndpointData = (endpoint) => {
        const buildPublicEndpointUrl = `${publicEndpoint}${formData?.endpoint_url}`;
        const buildProtectedEndpointUrl = `${protectedEndpoint}${formData?.endpoint_url}`;
        let configData = {
            endpoint: buildPublicEndpointUrl,
        };

        switch (endpoint) {
            case "email":
                configData.endpoint = getEndpointUrlByType(formData?.endpoint_url);
                configData.data = {
                    recipient: formData.email.recipient,
                    subject: formData.email.subject,
                    ["from"]: formData.email["from"],
                };
                break;
            case "account_details":
                configData.endpoint = buildProtectedEndpointUrl;
                configData.data = {auth_provider: props.session[SESSION_USER][SESSION_AUTH_PROVIDER]};
                break;
            case "custom":
                const customEndpoint = getCustomEndpoint();
                if (customEndpoint === null) {
                    configData = null;
                    break;
                }
                configData.endpoint = customEndpoint;
                configData.data = {};
                break;
            case "user_meta":
                configData.endpoint = buildProtectedEndpointUrl;
                configData.data = {};
                break;
            case "external_provider":
                configData.endpoint = getEndpointUrlByType('forms/external-providers');
                configData.data = {};
                break;
            default:
                configData = null;
                break;
        }
        return configData;
    }

    const getCustomEndpoint = () => {
        switch (formData?.endpoint_type) {
            case "public":
                return sprintf(wpApiConfig.endpoints.formsCustomPublic, formData.custom_endpoint);
            case "protected":
                return sprintf(wpApiConfig.endpoints.formsCustomProtected, formData.custom_endpoint);
            default:
                return null;
        }
    }

    const formSubmitCallback = (data) => {
        const requestData = {...data};
        const endpointData = getEndpointData(formData.endpoint);
        if (endpointData === null) {
            console.error("Invalid endpoint")
            return;
        }
        console.log("Endpoint data", requestData)
        let files = {};
        let fileKeys = [];
        Object.keys(requestData).forEach(key => {
            if (requestData[key] instanceof File) {
                files[key] = requestData[key]
                fileKeys.push(key)
            }
        })
        fileKeys.forEach(key => {
            delete requestData[key];
        })

        processRequest(
            endpointData,
            {
                ...requestData,
                ...endpointData.data,
                ...{
                    external_providers: formData?.external_providers,
                    redirect_url: formData?.redirect_url
                },
            },
            files
        )
    }

    const processRequest = async (endpointData, requestData = {}, files = {}) => {
        let hasFiles = false;
        let formValues = new FormData();
        if (!isObjectEmpty(files)) {
            hasFiles = true;
            requestData = {...requestData, ...files};
            Object.keys(requestData).forEach(key => formValues.append(key, requestData[key]));
            // Object.keys(endpointData.data).forEach(key => formValues.append(key, endpointData.data[key]))
        }
        let request = null;
        if (!['public', 'protected'].includes(formData?.endpoint_type)) {
            console.error("Invalid endpoint type")
            return;
        }
        if (!isNotEmpty(formData?.method)) {
            console.error("Invalid request method")
            return;
        }
        console.log({
            method: formData.method,
            endpoint: endpointData.endpoint,
            data: (hasFiles)? formValues : requestData,
            requestData,
            protectedReq: (formData?.endpoint_type === 'protected'),
            upload: hasFiles,
        })
        request = await wpResourceRequest({
            method: formData.method,
            endpoint: endpointData.endpoint,
            data: (hasFiles)? formValues : requestData,
            protectedReq: (formData?.endpoint_type === 'protected'),
            upload: hasFiles,
        })
        if (!request) {
            console.error("Invalid request")
            return;
        }
        await responseHandler(request)
    }

    const responseHandler = async (response) => {
        if (!isSet(response)) {
            return;
        }
        const responseData = await response.json();
        const errors = Array.isArray(responseData?.errors) ? responseData.errors : [];
        setResponse({
            showAlert: true,
            error: (errors.length),
            errors: errors,
            success: true,
            message: responseData?.message || ''
        })
        // if (isNotEmpty(response?.data?.redirect_url)) {
        //     window.location.href = response.data.redirect_url
        // }
        // setResponse({
        //     showAlert: true,
        //     error: true,
        //     errors: error?.response?.data?.errors || [],
        //     success: false,
        //     message: error?.response?.data?.message
        // })
    }

    const getDataFormProps = () => {
        return {
            classes: formData?.classes,
            data: buildFormData(formData?.form_type),
            formType: formData?.form_type === "list" ? "list" : "single",
            formId: isNotEmpty(formData.form_id) ? formData.form_id : "wp_form",
            submitCallback: formSubmitCallback,
            submitButtonText: (isNotEmpty(formData?.submit_button_label) ? formData.submit_button_label : submitButtonText),
            addListItemButtonText: (isNotEmpty(formData?.add_item_button_label) ? formData.add_item_button_label : addListItemButtonText)
        };
    }

    useEffect(() => {
        buildExternalRequestData();
    }, [props?.data]);

    return (
        <>
            {(!formData || !isObject(formData) || isObjectEmpty(formData))
                ? templateManager.render(<LoaderComponent/>)
                : (
                    <div className={formData.layout_style === "full-width" ? "container-fluid" : "container"}>
                        <div
                            className={"row justify-content-" + (isNotEmpty(formData.align) ? formData.align : "start")}>
                            <div
                                className={isNotEmpty(formData.column_size) ? "col-" + formData.column_size : "col-12"}>
                                {isNotEmpty(formData?.heading) &&
                                    <h1>{formData.heading}</h1>
                                }
                                {isNotEmpty(formData?.sub_heading) &&
                                    <p>{formData.sub_heading}</p>
                                }
                                {response.success
                                    ? (
                                        <div className="bg-white p-3">
                                            <p className={"text-center text-success"}>{response.message}</p>
                                        </div>
                                    )
                                    : (
                                        <div className="bg-white">
                                            <p className={"text-danger text-danger"}>{response.message}</p>
                                        </div>
                                    )
                                }
                                {Array.isArray(response.errors) && response.errors.length > 0 && (
                                    templateManager.render(<WPErrorDisplay errorData={response.errors}/>)
                                )}
                                {
                                    templateManager.render(
                                        <DataForm
                                            {...getDataFormProps()}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

FormBlock.category = 'public';
FormBlock.templateId = 'formBlock';

function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

export default connect(
    mapStateToProps,
    null
)(FormBlock);
