import {isNotEmpty, isObjectEmpty, isSet} from "../../../library/utils";
import DataForm from "../../forms/DataForm";
import React, {useState} from "react";
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import {wpApiConfig} from "../../../config/wp-api-config";
const sprintf = require("sprintf").sprintf;

const FormBlock = (props) => {
    if (!isSet(props?.data?.form?.form_data)) {
        return null;
    }

    const formData = props.data.form_data;
    console.log(formData)
    const [response, setResponse] = useState({
        error: false,
        success: false,
        message: ""
    })

    const selectData = {};
    const selectOptions = {};
    const checkboxData = {};
    const checkboxOptions = {};
    const radioData = {};
    const radioOptions = {};
    const submitButtonText = "Update";

    const buildFormData = () => {
        let configData = {};
        configData.fields = [];
        const rows = formData.form_rows;
        rows.map((row, rowIndex) => {
            row.form_row.map((item, itemIndex) => {
                let fieldConfig = getFormFieldConfig(item.form_item);
                if (fieldConfig) {
                    fieldConfig.rowIndex = rowIndex;
                    fieldConfig.columnIndex = itemIndex;
                    configData.fields.push(fieldConfig);
                }
            })
        })
        return configData;
    }

    const getFormFieldConfig = (options) => {
        console.log(options)
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
            case "text_area":
                fieldConfig.fieldType = "textarea";
                fieldConfig.rows = 4;
                break;
            case "select":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = options.control_settings.multiple;
                selectOptions[options.name] = options.control_settings.options;
                selectData[options.name] = [];
                break;
            case "checkbox":
                fieldConfig.fieldType = "checkbox";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                checkboxOptions[options.name] = options.control_settings.options;
                checkboxData[options.name] = [];
                break;
            case "radio":
                fieldConfig.fieldType = "radio";
                fieldConfig.value = options.control_settings.value;
                fieldConfig.checked = options.control_settings.checked;
                radioOptions[options.name] = options.control_settings.options;
                radioData[options.name] = [];
                break;
            case "date":
                fieldConfig.fieldType = "date";
                fieldConfig.format = "dd MMMM yyyy H:mm:s";
                fieldConfig.value = options.control_settings.date_value;
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
            case "custom":
                return {
                    endpoint: sprintf(wpApiConfig.endpoints.formsCustom, formData.custom_endpoint),
                    data: {}
                };
            default:
                return null;
        }
    }

    const formSubmitCallback = (data) => {
        const endpointData = getEndpointData(formData.endpoint);

        if (endpointData === null) {
            console.error("Invalid endpoint")
            return;
        }

        console.log({...data, ...endpointData.data})
        return;
        publicApiRequest(buildWpApiUrl(endpointData.endpoint), {...data, ...endpointData.data}, false, "post")
            .then(response => {
                console.log(response.data)
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
        const defaultProps = {
            data: buildFormData(),
            submitCallback: formSubmitCallback,
            submitButtonText: (isNotEmpty(formData.submit_button_label)? formData.submit_button_label : submitButtonText)
        }
        if (!isObjectEmpty(selectOptions)) {
            defaultProps.selectData = selectData
            defaultProps.selectOptions = selectOptions
        }
        if (!isObjectEmpty(checkboxOptions)) {
            defaultProps.checkboxData = checkboxData
            defaultProps.checkboxOptions = checkboxOptions
        }
        if (!isObjectEmpty(radioOptions)) {
            defaultProps.radioData = radioData
            defaultProps.radioOptions = radioOptions
        }
        console.log(defaultProps)
        return defaultProps;
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
                        <DataForm
                            {...getDataFormProps()}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FormBlock;