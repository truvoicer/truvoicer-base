import {isNotEmpty, isObject, isSet} from "@/truvoicer-base/library/utils";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {REQUEST_GET} from "@/truvoicer-base/library/constants/request-constants";
import {protectedEndpoint} from "@/truvoicer-base/config/wp-api-config";
import {fi} from "date-fns/locale";

export class DataFormHelpers {
    _contextData = {};
    _externalRequestData = {};
    _formData = null;

    getFormData() {
        return this._formData;
    }
    setFormData(value) {
        this._formData = value;
    }

    getContextData() {
        return this._contextData;
    }

    setContextData(value) {
        this._contextData = value;
    }

    getExternalRequestData() {
        return this._externalRequestData;
    }

    setExternalRequestData(value) {
        this._externalRequestData = value;
    }

    static getFieldByName(name = null, fields = []) {
        let fieldObject = {};
        fields.map(field => {
            if (isSet(field.subFields)) {
                field.subFields.map((subField) => {
                    if (subField?.name === name) {
                        fieldObject = subField
                    }
                })
            }
            if (field.name === name) {
                fieldObject = field
            }
        })
        return fieldObject
    }

    buildListFields(fields = [], dataObject = {}) {
        let listData = {};
        Object.keys(dataObject).forEach((key) => {
            if (!Array.isArray(dataObject[key])) {
                return;
            }
            listData[key] = dataObject[key].map((item, index) => {
                return Object.keys(item).map((subKey) => {
                    const field = DataFormHelpers.getFieldByName(subKey, fields);
                    return this.getFormFieldConfig(field, index);
                });
            });
        });
        return listData;
    }

    getFormFieldValue(option, defaultValue, index = null) {
        switch (this._formData?.form_type) {
            case "single":
                if (this._contextData.hasOwnProperty(option.name)) {
                    return this._contextData[option.name];
                }
                break;
            case "list":
                if (
                    !isNaN(index) &&
                    this._contextData.hasOwnProperty(this._formData?.form_id) &&
                    Array.isArray(this._contextData[this._formData?.form_id]) &&
                    this._contextData[this._formData?.form_id].hasOwnProperty(index) &&
                    this._contextData[this._formData?.form_id][index].hasOwnProperty(option.name)
                ) {
                    return this._contextData[this._formData?.form_id][index][option.name];
                }
                break;
        }
        if (option.hasOwnProperty('value')) {
            return option.value;
        }
        return defaultValue;
    }

    getFormFieldSelectValue(option, defaultValue, index = null) {
        let value;
        switch (this._formData?.form_type) {
            case "single":
                if (this._contextData.hasOwnProperty(option.name)) {
                    value = this._contextData[option.name];
                }
                break;
            case "list":
                if (
                    !isNaN(index) &&
                    this._contextData.hasOwnProperty(this._formData?.form_id) &&
                    Array.isArray(this._contextData[this._formData?.form_id]) &&
                    this._contextData[this._formData?.form_id].hasOwnProperty(index) &&
                    this._contextData[this._formData?.form_id][index].hasOwnProperty(option.name)
                ) {
                    value = this._contextData[this._formData?.form_id][index][option.name];
                }
                break;
        }
        if (typeof value === 'undefined' && option.hasOwnProperty('value')) {
            value = option.value;
        }
        switch (option.form_control) {
            case "select_data_source":
                if (Array.isArray(value)) {
                    return value.map((item) => {
                        let cloneItem = {...item};
                        cloneItem.label = item?.label;
                        cloneItem.value = item?.value;
                        return cloneItem;
                    }).filter((item) => isNotEmpty(item?.label))
                }
                if (isObject(value) && isNotEmpty(value?.label)) {
                    let cloneItem = {...value};
                    cloneItem.label = value?.label;
                    cloneItem.value = value?.value;
                    return cloneItem;
                }
                break;
        }
        return defaultValue;
    }

    async getExternalRequestFormFieldValue(option) {
        switch (option.form_control) {
            case "select":
            case "select_countries":
            case "select_data_source":
                return await this.getSelectEndpointData(option?.endpoint);
            default:
                return false;
        }
    }

    async getSelectEndpointData(endpoint) {
        if (!endpoint) {
            return;
        }
        //if endpoint starts with forward slash
        if (!endpoint.startsWith("/")) {
            endpoint = `/${endpoint}`;
        }
        const response = await wpResourceRequest({
            method: REQUEST_GET,
            endpoint: `${protectedEndpoint}${endpoint}`,
            protectedReq: true
        });
        const responseData = await response.json();
        if (responseData.status !== "success") {
            return [];
        }
        if (!Array.isArray(responseData?.data)) {
            return [];
        }
        return responseData.data
    }

    buildFormFieldValue(option, index = null) {
        let fieldConfig = {...option};
        switch (fieldConfig.form_control) {
            case "text":
            case "email":
            case "password":
            case "tel":
            case "textarea":
                fieldConfig.value = this.getFormFieldValue(option, "", index);
                break;
            case "select":
            case "select_countries":
            case "select_data_source":
                fieldConfig.value = this.getFormFieldSelectValue(option, [], index);
                break;
            case "date":
            case "radio":
            case "checkbox":
                fieldConfig.value = this.getFormFieldValue(option, option.value, index);
                break;
        }
        return fieldConfig;
    }

    getFormFieldConfig(options, index = null) {
        let fieldConfig = {...options};

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
                fieldConfig.multi = options?.multiple || false;
                if (this._externalRequestData.hasOwnProperty(options.name)) {
                    fieldConfig.options = this._externalRequestData[options.name];
                } else {
                    fieldConfig.options = options?.options || [];
                }
                fieldConfig.data = [];
                break;
            case "select_countries":
                fieldConfig.fieldType = "select";
                fieldConfig.multi = false;
                if (this._externalRequestData.hasOwnProperty(options.name)) {
                    fieldConfig.options = this._externalRequestData[options.name];
                } else {
                    fieldConfig.options = options?.options || [];
                }
                fieldConfig.data = [];
                break;
            case "select_data_source":
                fieldConfig.fieldType = "select_data_source";
                fieldConfig.multi = options?.multiple || false;
                if (this._externalRequestData.hasOwnProperty(options.name)) {
                    fieldConfig.options = this._externalRequestData[options.name];
                } else {
                    fieldConfig.options = options?.options || [];
                }
                fieldConfig.data = [];
                break;
            case "checkbox":
                fieldConfig.fieldType = "checkbox";
                fieldConfig.value = options?.value || false;
                fieldConfig.checked = options?.checked || false;
                fieldConfig.options = options?.options || [];
                fieldConfig.data = [];
                break;
            case "radio":
                fieldConfig.fieldType = "radio";
                fieldConfig.value = options?.value || false;
                fieldConfig.checked = options?.checked || false;
                fieldConfig.options = options?.options || [];
                fieldConfig.data = [];
                break;
            case "date":
                fieldConfig.fieldType = "date";
                fieldConfig.format = "dd MMMM yyyy";
                fieldConfig.value = options?.date_value || '';
                break;
            case "image_upload":
                fieldConfig.fieldType = "image_upload";
                fieldConfig.showDropzone = options?.show_dropzone;
                fieldConfig.dropzoneMessage = options?.dropzone_message
                fieldConfig.acceptedFileTypesMessage = options?.accepted_file_types_message
                break;
            case "file_upload":
                fieldConfig.fieldType = "file_upload";
                fieldConfig.showDropzone = options?.show_dropzone || false;
                fieldConfig.allowedFileTypes = options?.allowed_file_types || [];
                fieldConfig.dropzoneMessage = options?.dropzone_message || "";
                fieldConfig.acceptedFileTypesMessage = options?.accepted_file_types_message || "";
                break;
            default:
                return false;
        }
        fieldConfig.name = options.name;
        fieldConfig.description = options?.description;
        fieldConfig.placeHolder = options.placeholder;
        fieldConfig.label = options.label;
        fieldConfig.labelPosition = options.label_position;
        return this.buildFormFieldValue(fieldConfig, index);
    }
}
