import {isNotEmpty, isObjectEmpty, isSet} from "../../../library/utils";
import DataForm from "../../forms/DataForm/DataForm";
import React, {useEffect, useState} from "react";
import {
    buildWpApiUrl,
    protectedApiRequest,
    protectedFileUploadApiRequest,
    publicApiRequest
} from "../../../library/api/wp/middleware";
import {wpApiConfig} from "../../../config/wp-api-config";
import {connect} from "react-redux";
import {ChangePasswordFormFields} from "../../../config/forms/change-password-form-fields";
import {SESSION_AUTH_TYPE, SESSION_USER} from "../../../redux/constants/session-constants";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

const sprintf = require("sprintf").sprintf;

const FormBlock = (props) => {
    if (!isSet(props?.data?.form?.form_data)) {
        return null;
    }

    const formData = props.data.form.form_data;
    const [response, setResponse] = useState({
        showAlert: false,
        error: false,
        success: false,
        message: ""
    })
    const [formDataConfig, setFormDataConfig] = useState({});
    const [userData, setUserData] = useState({});
    const submitButtonText = "Update";
    const addListItemButtonText = "Add new item";

    useEffect(() => {
        setFormConfigData(formData.endpoint)
    }, [formData])

    useEffect(() => {
        setFormDataConfig(buildFormData(formData.form_type))
    }, [userData])

    const setFormConfigData = (endpoint) => {
        switch (endpoint) {
            case "user_meta":
            case "user_profile":
            case "account_details":
                getUserDataRequest(getSavedData(), endpoint)
                break;
            default:
                setFormDataConfig(buildFormData(formData.form_type))
                break;
        }
    }

    const updateFieldConfig = (configArray, fieldName, key, value) => {
        const fieldIndex = configArray.findIndex(item => {
            return item.name === fieldName;
        })
        configArray[fieldIndex][key] = value
        return configArray;
    }

    const getSelectEndpointData = (name, key, endpoint) => {
        publicApiRequest(buildWpApiUrl(sprintf(wpApiConfig.endpoints.generalData, endpoint)), {})
            .then(response => {
                if (response.data.status === "success") {
                    setFormDataConfig(formDataConfig => {
                        let configData = {...formDataConfig};
                        configData.fields = updateFieldConfig(configData.fields, name, key, response.data.data)
                        return configData;
                    })
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    const getUserDataRequest = (savedData, endpoint) => {
        let apiEndpoint = wpApiConfig.endpoints.formsUserMetaDataRequest;
        if (endpoint === "account_details") {
            apiEndpoint = wpApiConfig.endpoints.userAccountDataRequest;
        }
        protectedApiRequest(
            buildWpApiUrl(apiEndpoint),
            savedData,
            false
        )
            .then(response => {
                if (response.data.status === "success") {
                    setUserData(response.data.data)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    const getSavedData = () => {
        let form = {
            type: formData.form_type,
            id: formData.form_id,
            fields: []
        };
        formRowsIterator({
            rows: formData.form_rows,
            callback: (item, itemIndex, rowIndex) => {
                form.fields.push({
                    form_control: item.form_item.form_control,
                    name: item.form_item.name
                })
            }
        });
        return {form: form};
    }

    const formRowsIterator = ({rows, callback}) => {
        rows.map((row, rowIndex) => {
            row.form_row.map((item, itemIndex) => {
                callback(item, itemIndex, rowIndex)
            })
        })
    }

    const buildFormData = (formType) => {
        let configData = {
            fields: [],
            dataObject: {}
        };
        switch (formType) {
            case "single":
                configData.fields = buildSingleFormTypeData(userData);
                break;
            case "list":
                const dataObject = buildSingleFormTypeData(userData);
                configData.fields = dataObject;
                configData[formData.form_id] = userData[formData.form_id]
        }
        return configData;
    }

    const buildSingleFormTypeData = (userDataValues) => {
        let configData = [];
        formRowsIterator({
            rows: formData.form_rows,
            callback: (item, itemIndex, rowIndex) => {
                let fieldConfig = getFormFieldConfig(item.form_item);
                if (fieldConfig) {
                    fieldConfig.rowIndex = rowIndex;
                    fieldConfig.columnIndex = itemIndex;
                    if (isSet(userDataValues[fieldConfig.name])) {
                        fieldConfig.value = userDataValues[fieldConfig.name];
                    }
                    configData.push(fieldConfig);
                }
            }
        });
        if (formData.endpoint === "account_details") {
            return [...configData, ...ChangePasswordFormFields()]
        }
        return configData;
    }

    const getFormFieldConfig = (options) => {
        let fieldConfig = {};
        switch (options.form_control) {
            case "text":
                fieldConfig.fieldType = "text";
                fieldConfig.type = "text";
                break;
            case "email":
                fieldConfig.fieldType = "text";
                fieldConfig.type = "email";
                break;
            case "password":
                fieldConfig.fieldType = "text";
                fieldConfig.type = "password";
                break;
            case "tel":
                fieldConfig.fieldType = "tel";
                break;
            case "textarea":
                fieldConfig.fieldType = "textarea";
                fieldConfig.rows = 4;
                break;
            case "select":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = options.control_settings.multiple;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data = [];
                break;
            case "select_countries":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = false;
                fieldConfig.options = options?.countries_list;
                fieldConfig.data = [];
                break;
            case "select_data_source":
                fieldConfig.fieldType = "select_data_source";
                fieldConfig.multi = options.control_settings.multiple;
                fieldConfig.data = [];
                getSelectEndpointData(options.name, "options", options.control_settings.endpoint)
                break;
            case "checkbox":
                fieldConfig.fieldType = "checkbox";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data = [];
                break;
            case "radio":
                fieldConfig.fieldType = "radio";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data = [];
                break;
            case "date":
                fieldConfig.fieldType = "date";
                fieldConfig.format = "dd MMMM yyyy";
                fieldConfig.value = options.control_settings.date_value;
                break;
            case "image_upload":
                fieldConfig.fieldType = "image_upload";
                fieldConfig.showDropzone = options.control_settings?.show_dropzone;
                fieldConfig.dropzoneMessage = options.control_settings.dropzone_message
                fieldConfig.acceptedFileTypesMessage = options.control_settings.accepted_file_types_message
                break;
            case "file_upload":
                fieldConfig.fieldType = "file_upload";
                fieldConfig.showDropzone = options.control_settings?.show_dropzone;
                fieldConfig.allowedFileTypes = options.control_settings.allowed_file_types
                fieldConfig.dropzoneMessage = options.control_settings.dropzone_message
                fieldConfig.acceptedFileTypesMessage = options.control_settings.accepted_file_types_message
                break;
            default:
                return false;
        }
        fieldConfig.name = options.name;
        fieldConfig.description = options?.description;
        fieldConfig.placeHolder = options.placeholder;
        fieldConfig.label = options.label;
        fieldConfig.labelPosition = options.label_position;
        return fieldConfig;
    }

    const getEndpointData = (endpoint) => {
        switch (endpoint) {
            case "email":
                return {
                    endpoint: wpApiConfig.endpoints.formsEmail,
                    data: {
                        recipient: formData.email.recipient,
                        subject: formData.email.subject,
                        ["from"]: formData.email["from"],
                    }
                };
            case "user_meta":
                return {
                    endpoint: wpApiConfig.endpoints.formsUserMeta,
                    data: {}
                };
            case "user_profile":
                return {
                    endpoint: wpApiConfig.endpoints.userProfileUpdate,
                    data: {}
                };
            case "account_details":
                return {
                    endpoint: wpApiConfig.endpoints.updateUser,
                    data: {
                        auth_type: props.session[SESSION_USER][SESSION_AUTH_TYPE]
                    }
                };
            case "redirect":
                return {
                    endpoint: wpApiConfig.endpoints.formsRedirectPublic,
                    data: {}
                };
            case "custom":
                const customEndpoint = getCustomEndpoint();
                if (customEndpoint === null) {
                    return null;
                }
                return {
                    endpoint: customEndpoint,
                    data: {}
                };
            default:
                return null;
        }
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

    const getFileUploadRequest = (data, endpointData) => {
        let formValues = data;
        const headers = {
            'Content-Type': 'multipart/form-data'
        };

        formValues = new FormData();
        Object.keys(data).forEach(key => formValues.append(key, data[key]));
        Object.keys(endpointData.data).forEach(key => formValues.append(key, endpointData.data[key]));

        responseHandler(
            protectedFileUploadApiRequest(
                buildWpApiUrl(endpointData.endpoint),
                formValues,
                false,
                headers,
            )
        )
    }

    const formSubmitCallback = (data) => {
        const requestData = {...data};
        const endpointData = getEndpointData(formData.endpoint);
        if (endpointData === null) {
            console.error("Invalid endpoint")
            return;
        }

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

        if (!isObjectEmpty(files)) {
            getFileUploadRequest(files, endpointData);
        }

        processRequest(
            endpointData,
            {
                ...requestData,
                ...endpointData.data,
                ...{
                    endpoint_providers: formData?.endpoint_providers,
                    redirect_url: formData?.redirect_url
                }
            }
        )
    }

    const processRequest = (endpointData, requestData) => {
        switch (formData?.endpoint_type) {
            case "public":
                responseHandler(
                    publicApiRequest(
                        buildWpApiUrl(endpointData.endpoint),
                        requestData,
                        false,
                        "post"
                    )
                );
                break;
            case "protected":
                responseHandler(
                    protectedApiRequest(
                        buildWpApiUrl(endpointData.endpoint),
                        requestData,
                        false
                    )
                );
                break;
            default:
                return;
        }
    }

    const responseHandler = (request) => {
        request.then(response => {
            setResponse({
                showAlert: true,
                error: false,
                success: true,
                message: response?.data?.message
            })
            if (isNotEmpty(response?.data?.data?.redirect_url)) {
                window.location.href = response.data.data.redirect_url
            }
        })
            .catch(error => {
                setResponse({
                    showAlert: true,
                    error: true,
                    success: false,
                    message: error?.response?.data?.message
                })
                console.error(error)
            })
    }

    const getDataFormProps = () => {
        return {
            classes: formData?.classes,
            data: formDataConfig,
            formType: formData?.form_type === "list" ? "list" : "single",
            formId: isNotEmpty(formData.form_id) ? formData.form_id : "wp_form",
            submitCallback: formSubmitCallback,
            submitButtonText: (isNotEmpty(formData?.submit_button_label) ? formData.submit_button_label : submitButtonText),
            addListItemButtonText: (isNotEmpty(formData?.add_item_button_label) ? formData.add_item_button_label : addListItemButtonText)
        };
    }
    return (
        <div className={formData.layout_style === "full-width" ? "container-fluid" : "container"}>
            <div className={"row justify-content-" + (isNotEmpty(formData.align) ? formData.align : "start")}>
                <div className={isNotEmpty(formData.column_size) ? "col-" + formData.column_size : "col-12"}>
                    {isNotEmpty(formData?.heading) &&
                    <h3>{formData.heading}</h3>
                    }
                    {isNotEmpty(formData?.sub_heading) &&
                    <p>{formData.sub_heading}</p>
                    }
                    {response.success &&
                    <div className="bg-white p-3">
                        <p className={"text-center text-success"}>{response.message}</p>
                    </div>
                    }
                    {response.error &&
                    <div className="bg-white">
                        <p className={"text-danger text-danger"}>{response.message}</p>
                    </div>
                    }
                    {!isObjectEmpty(formDataConfig) &&
                    <DataForm
                        {...getDataFormProps()}
                    />
                    }
                </div>
            </div>
            <Snackbar open={response.showAlert}
                      autoHideDuration={6000}
                      onClose={() => {
                          setResponse(response => {
                              return {...response, ...{showAlert: false}}
                          })
                      }}
            >
                <SnackbarContent
                    message={response.message}
                    // role={response.success ? "success" : "error"}
                />
            </Snackbar>
        </div>
    )
}


function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

export default connect(
    mapStateToProps,
    null
)(FormBlock);
