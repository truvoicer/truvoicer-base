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

const sprintf = require("sprintf").sprintf;

const FormBlock = (props) => {
    if (!isSet(props?.data?.form?.form_data)) {
        return null;
    }

    const formData = props.data.form.form_data;
    const [response, setResponse] = useState({
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
            case "telephone":
                fieldConfig.fieldType = "text";
                fieldConfig.type = "tel";
                break;
            case "textarea":
                fieldConfig.fieldType = "textarea";
                fieldConfig.rows = 4;
                break;
            case "select":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = options.control_settings.multiple;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data =  [];
                break;
            case "select_countries":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = false;
                fieldConfig.options = options?.countries_list;
                fieldConfig.data =  [];
                break;
            case "select_data_source":
                fieldConfig.fieldType = "select_data_source";
                fieldConfig.multi = options.control_settings.multiple;
                fieldConfig.data =  [];
                getSelectEndpointData(options.name, "options", options.control_settings.endpoint)
                break;
            case "checkbox":
                fieldConfig.fieldType = "checkbox";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data =  [];
                break;
            case "radio":
                fieldConfig.fieldType = "radio";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                fieldConfig.options = options.control_settings.options;
                fieldConfig.data =  [];
                break;
            case "date":
                fieldConfig.fieldType = "date";
                fieldConfig.format = "dd MMMM yyyy H:mm:s";
                fieldConfig.value = options.control_settings.date_value;
                break;
            case "image_upload":
                fieldConfig.fieldType = "image_upload";
                break;
            case "file_upload":
                fieldConfig.fieldType = "file_upload";
                fieldConfig.allowedFileTypes = options.control_settings.allowed_file_types
                break;
            default:
                return false;
        }
        fieldConfig.name = options.name;
        fieldConfig.placeHolder = options.placeholder;
        fieldConfig.label = options.label;
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

        return protectedFileUploadApiRequest(
            buildWpApiUrl(endpointData.endpoint),
            formValues,
            false,
            headers,
        )
    }

    const formSubmitCallback = (data) => {
        const endpointData = getEndpointData(formData.endpoint);
        if (endpointData === null) {
            console.error("Invalid endpoint")
            return;
        }

        let hasFile = false;
        Object.keys(data).forEach(key => {
            if (data[key] instanceof File) {
                hasFile = true;
            }
        })

        let apiRequest;
        if (hasFile) {
            apiRequest = getFileUploadRequest(data, endpointData);
        } else {
            apiRequest = protectedApiRequest(
                buildWpApiUrl(endpointData.endpoint),
                {...data, ...endpointData.data},
                false
            );
        }

        apiRequest.then(response => {
            setResponse({
                error: false,
                success: true,
                message: response?.data?.message
            })
        })
            .catch(error => {
                setResponse({
                    error: true,
                    success: false,
                    message: error?.response?.data?.message
                })
                console.error(error)
            })

    }

    const getDataFormProps = () => {
        return {
            data: formDataConfig,
            formType: formData?.form_type === "list" ? "list" : "single",
            formId: isNotEmpty(formData.form_id) ? formData.form_id : "wp_form",
            submitCallback: formSubmitCallback,
            submitButtonText: (isNotEmpty(formData?.submit_button_label) ? formData.submit_button_label : submitButtonText),
            addListItemButtonText: (isNotEmpty(formData?.add_item_button_label) ? formData.add_item_button_label : addListItemButtonText)
        };
    }

    return (
        <div className={"m-5"}>
            <div className={formData.layout_style === "full-width" ? "container-fluid" : "container"}>
                <div className={"row justify-content-" + (isNotEmpty(formData.align) ? formData.align : "start")}>
                    <div className={isNotEmpty(formData.column_size) ? "col-" + formData.column_size : "col-12"}>
                        <h1>{formData.heading}</h1>
                        <p>{formData.sub_heading}</p>
                        {response.success &&
                        <div className="bg-white p-3">
                            <p className={"text-center"}>{response.message}</p>
                        </div>
                        }
                        {response.error &&
                        <div className="bg-white">
                            <p className={"text-danger"}>{response.message}</p>
                        </div>
                        }
                        {!isObjectEmpty(formDataConfig) &&
                        <DataForm
                            {...getDataFormProps()}
                        />
                        }
                    </div>
                </div>
            </div>
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