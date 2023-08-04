import React, {useEffect, useState} from 'react';
import {FieldArray, Formik, isObject} from "formik";
import {isNotEmpty, isSet} from "../../../library/utils";
import FormFieldLabel from "./Fields/FormFieldLabel";
import FormFieldItem from "./Fields/FormFieldItem";

const sprintf = require("sprintf");
const DataForm = (props) => {

    const formId = props?.formId ?? "fields";

    const getInitialDataObject = () => {
        let initialValues = {};
        props.data.fields.map((item) => {
            const value = getInitialValue(item);
            if (value !== null) {
                initialValues[item.name] = value;
            }
            if (isSet(item.subFields)) {
                item.subFields.map((subItem) => {
                    const subValue = getInitialValue(subItem);
                    if (subValue !== null) {
                        initialValues[subItem.name] = subValue;
                    }
                })
            }
        })
        return initialValues;
    }

    const getInitialValue = (item) => {
        let value;
        switch (item.fieldType) {
            case "text":
            case "textarea":
            case "date":
            case "image_upload":
            case "file_upload":
                value = isSet(item.value) ? item.value : "";
                break;
            case "select":
            case "select_data_source":
            case "radio":
                value = isSet(item.value) ? item.value : {};
                break;
            case "checkbox":
                if (isSet(item.checkboxType) && item.checkboxType === "true_false") {
                    value = !!(isSet(item.checked) && item.checked);
                } else {
                    value = isSet(item.value) ? item.value : {};
                }
                break;
        }
        return value;
    }

    const validationRules = (rule, values, key) => {
        switch (rule.type) {
            case "required":
                const field = getFieldByName(key);
                if (!values[key]) {
                    return 'Required';
                }
                break;
            case "email_alphanumeric":
                if (!/^[\w_@.-]+$/.test(values[key])) {
                    return 'Can only contain letters, numbers and the following characters (@) (_) (-) (.)';
                }
                break;
            case "email":
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[key])) {
                    return 'Invalid email address';
                }
                break;
            case "alphanumeric":
                if (!/^[\w_ ]+$/.test(values[key])) {
                    return 'Can only contain letters and numbers';
                }
                break;
            case "length":
                if (values[key].length < parseInt(rule.min)) {
                    return sprintf('Must be more than %d characters', rule.min);
                } else if (values[key].length > parseInt(rule.max)) {
                    return sprintf('Must be less than %d characters', rule.max)
                }
                break;
            case "password":
                let conditions = "";
                rule.allowedChars?.map((char) => {
                    if (char === "alphanumeric") {
                        conditions += "[A-Z0-9.-]";
                    }
                    if (char === "symbols") {
                        conditions += "[*.! @#$%^&(){}[]:;<>,.?/~_+-=|\\]";
                    }
                })
                const regEx = new RegExp(sprintf("!/^%s$/i", conditions));
                if (regEx.test(values[key])) {
                    return sprintf("Can only contain (%s)", rule.allowedChars.join(", "));
                }
                break;
            case "match":
                if (values[key] !== values[rule.matchField]) {
                    return sprintf('Does not match with %s', getFieldByName(rule.matchField).label);
                }
                break;
        }
        return true;
    }

    const getFieldByName = (name) => {
        let fieldObject = {};
        props.data.fields.map(field => {
            if (isSet(field.subFields)) {
                field.subFields.map((subField) => {
                    if (subField.name === name) {
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
    const getIgnoredFields = (values) => {
        let ignoredFields = [];
        Object.keys(values).map((key) => {
            const field = getFieldByName(key);
            field.subFields?.map((subField) => {
                if ((field.fieldType === "checkbox" && !values[field.name]) ||
                    (field.fieldType === "checkbox" && values[field.name] === "")) {
                    ignoredFields.push(subField.name);
                }
            })
        });
        return ignoredFields;
    }
    const validateForm = (values) => {
        const errors = {};

        const ignoredFields = getIgnoredFields(values);
        Object.keys(values).map((key) => {
            const field = getFieldByName(key);
            if (!ignoredFields.includes(field.name)) {
                const isAllowEmpty = field.validation?.rules?.filter(rule => rule.type === "allow_empty");
                if (!isSet(isAllowEmpty) ||
                    (Array.isArray(isAllowEmpty) && isAllowEmpty.length > 0 && values[field.name] !== "") ||
                    (Array.isArray(isAllowEmpty) && isAllowEmpty.length === 0)
                ) {
                    field.validation?.rules?.map((rule) => {
                        const validate = validationRules(rule, values, key);
                        if (validate !== true) {
                            errors[key] = validate
                        }
                    })
                }
            }
        })
        return errors;
    };

    const formSubmitHandler = (values) => {
        const ignoredFields = getIgnoredFields(values);
        Object.keys(values).map((key) => {
            const field = getFieldByName(key);
            if (field.fieldType === "checkbox" && values[field.name] === "") {
                values[field.name] = false;
            }
            if (ignoredFields.includes(key)) {
                values[key] = "";
            }
        });
        props.submitCallback(values);
    }

    const dependsOnCheck = (field, values) => {
        let show = false;
        if (isSet(field.dependsOn)) {
            if (isObject(values[field.dependsOn.field]) && field.dependsOn.value === values[field.dependsOn.field].value) {
                show = true;
            } else if (field.dependsOn.value === values[field.dependsOn.field]) {
                show = true;
            }
        } else if (!isSet(field.dependsOn)) {
            show = true;
        }
        return show;
    }
    const getFieldItemLabelPair = (field, errors, touched, handleBlur, handleChange, values, arrayFieldIndex) => {
        const formFieldLabel = (<FormFieldLabel field={field} errors={errors}/>)
        const formFieldItem = (
            <FormFieldItem
                formId={formId}
                field={field}
                arrayFieldIndex={arrayFieldIndex}
                handleChange={handleChange}
                handleBlur={handleBlur}
            />
        );
        switch (field?.labelPosition) {
            case "right":
                return (
                    <>
                        <div className="col-md-9">
                            {formFieldItem}
                            {isNotEmpty(field?.description) &&
                            <p className={"field-description"}>
                                {field.description}
                            </p>
                            }
                        </div>
                        <div className="col-md-3">
                            {formFieldLabel}
                        </div>
                    </>
                )
            case "left":
                return (
                    <>
                        <div className="col-md-3">
                            {formFieldLabel}
                        </div>
                        <div className="col-md-9 text-left">
                            {formFieldItem}
                            {isNotEmpty(field?.description) &&
                            <p className={"field-description"}>
                                {field.description}
                            </p>
                            }
                        </div>
                    </>
                )
            case "top":
            default:
                if (field?.name === 'skill') {
                    console.log({field})
                }
                return (
                    <div className="col-md-12">
                        {formFieldLabel}
                        {formFieldItem}
                    </div>
                )
        }
    }

    const getFieldRow = (field, errors, touched, handleBlur, handleChange, values, arrayFieldIndex = false) => {
        return (
            <>
                {dependsOnCheck(field, values) &&
                <div className={"select-wrapper"}>
                    <div className="row form-group form-group-text">
                        {getFieldItemLabelPair(field, errors, touched, handleBlur, handleChange, values, arrayFieldIndex)}
                    </div>
                    {field.subFields && values[field.name] &&
                    <div className={"form-subfields"}>
                        {field.subFields.map((subField, subFieldIndex) => (
                            <React.Fragment key={subFieldIndex}>
                                {getFieldRow(subField, errors, touched, handleBlur, handleChange, values)}
                            </React.Fragment>
                        ))}
                    </div>
                    }
                </div>
                }
            </>
        )
    }

    const getFields = (fields) => {
        let buildFields = [];
        fields.map((field, index) => {
            let rowIndex = field?.rowIndex;
            let columnIndex = field?.columnIndex;
            if (!isSet(rowIndex)) {
                rowIndex = index;
            }
            if (!isSet(columnIndex)) {
                columnIndex = 0;
            }
            if (!isSet(buildFields[rowIndex])) {
                buildFields[rowIndex] = [];
            }
            buildFields[rowIndex][columnIndex] = field
        })
        return buildFields;
    }

    const getGridColumnClasses = (row) => {
        const columnSize = Math.round(12 / row.length);
        return "col-" + columnSize.toString()
    }

    const [initialValues, setInitialValues] = useState({})

    useEffect(() => {
        setInitialValues(initialValues => {
            switch (props.formType) {
                case "list":
                    return {...props.data, ...{dataObject: getInitialDataObject()}};
                case "single":
                default:
                    return getInitialDataObject()
            }
        })
    }, [props.data, props.formType])

    const buildFormRows = (data, errors, touched, handleBlur, handleChange, values, arrayFieldIndex = false) => {
        return (
            <div className={"row"}>
                {getFields(data.fields).map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((field, index) => (
                            <div className={getGridColumnClasses(row)} key={index}>
                                {getFieldRow(field, errors, touched, handleBlur, handleChange, values, arrayFieldIndex)}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        )
    }
    return (
        <Formik
            initialValues={initialValues}
            validate={values => validateForm(values)}
            onSubmit={values => formSubmitHandler(values)}
            enableReinitialize={true}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
              }) => (
                <>
                    <form
                        className={`site-form ${isNotEmpty(props.classes) ? props.classes : ""}`}
                        onSubmit={handleSubmit}
                    >
                        {props.formType === "single"
                            ?
                            buildFormRows(props.data, errors, touched, handleBlur, handleChange, values)
                            :
                            <FieldArray
                                name={formId}
                                render={arrayHelpers => {
                                    return (
                                        <div>
                                            {Array.isArray(values[formId]) && values[formId].map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        {buildFormRows(props.data, errors, touched, handleBlur, handleChange, values, index)}
                                                    </React.Fragment>
                                                )
                                            })}
                                            <button
                                                type="button"
                                                onClick={() => arrayHelpers.push(initialValues.dataObject)}
                                            >
                                                {props.addListItemButtonText}
                                            </button>
                                        </div>
                                    )
                                }}
                            />
                        }
                        <div className="row form-group">
                            <div className="col-md-12">
                                <input type="submit"
                                       value={props.submitButtonText}
                                       className="btn btn-primary py-2 px-4 text-white"
                                />
                            </div>
                        </div>

                        {props.children}

                    </form>
                </>
            )}
        </Formik>
    );
}
export default DataForm;
