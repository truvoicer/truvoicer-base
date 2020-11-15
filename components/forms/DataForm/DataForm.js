import React, {Component, useEffect, useState} from 'react';
import {Field, FieldArray, Formik, isObject} from "formik";
import {isSet} from "../../../library/utils";
import Select from "react-select";
import DatePicker from "react-datepicker";
import FormFieldLabel from "./Fields/FormFieldLabel";
import FormFieldItem from "./Fields/FormFieldItem";

const sprintf = require("sprintf");
const DataForm = (props) => {

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
        if (item.fieldType === "text") {
            value = isSet(item.value) ? item.value : "";
        } else if (item.fieldType === "textarea") {
            value = isSet(item.value) ? item.value : "";
        } else if (item.fieldType === "select") {
            value = isSet(props.selectData[item.name]) ? props.selectData[item.name] : [];
        } else if (item.fieldType === "checkbox") {
            if (isSet(item.checkboxType) && item.checkboxType === "true_false") {
                value = !!(isSet(item.checked) && item.checked);
            } else if (isSet(props.checkboxData[item.name])) {
                value = isSet(props.checkboxData[item.name]) ? props.checkboxData[item.name] : [];
            }
        } else if (item.fieldType === "radio") {
            if (isSet(props.radioData[item.name])) {
                value = isSet(props.radioData[item.name]) ? props.radioData[item.name] : [];
            }
        } else if (item.fieldType === "date") {
            value = isSet(item.value) ? item.value : "";
        }
        return value;
    }

    const getListItemsDefaults = (fieldType) => {
        let fieldDefaults = {};
        props.data.fields.map((item) => {
            if (item.fieldType === fieldType) {
                const value = getInitialValue(item);
                if (value !== null) {
                    fieldDefaults[item.name] = value;
                }
            }
            if (isSet(item.subFields)) {
                item.subFields.map((subItem) => {
                    const subValue = getInitialValue(subItem);
                    if (subValue !== null) {
                        fieldDefaults[subItem.name] = subValue;
                    }
                })
            }
        });
        return fieldDefaults;
    }

    const getDatesDefaults = () => {
        let datesDefaults = {};
        props.data.fields.map((item) => {
            const value = getInitialValue(item);
            if (value !== null) {
                datesDefaults[item.name] = value;
            }
        });
        return datesDefaults;
    }

    const [initialValues, setInitialValues] = useState({})
    const [selected, setSelected] = useState(getListItemsDefaults("select"))
    const [checkboxes, setCheckboxes] = useState(getListItemsDefaults("checkbox"))
    const [radios, setRadios] = useState(getListItemsDefaults("radio"))
    const [dates, setDates] = useState(getDatesDefaults())


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
        console.log(values)
        // props.submitCallback(values);
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

    const getFieldRow = (field, errors, touched, handleBlur, handleChange, values, arrayFieldIndex = false) => {
        return (
            <>
                {dependsOnCheck(field, values) &&
                <div className={"select-wrapper"}>
                    <div className="row form-group form-group-text">
                        <div className="col-md-12">
                            <FormFieldLabel field={field} errors={errors}/>
                            <FormFieldItem
                                field={field}
                                arrayFieldIndex={arrayFieldIndex}
                                dates={dates}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                checkboxOptions={props.checkboxOptions}
                                radioOptions={props.radioOptions}
                                selectOptions={props.selectOptions}
                                selected={selected}
                            />
                        </div>
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
        // console.log(fields)
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

    useEffect(() => {
        setInitialValues(initialValues => {
            switch (props.formType) {
                case "list":
                    const dataObject = getInitialDataObject();
                    const initialObject = {};
                    initialObject.fields = [];
                    initialObject.dataObject = dataObject;
                    initialObject.fields.push(dataObject)
                    // console.log(initialObject)
                    return initialObject;
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
                        className="site-form"
                        onSubmit={handleSubmit}
                    >
                        {props.formType === "single"
                            ?
                            buildFormRows(props.data, errors, touched, handleBlur, handleChange, values)
                            :
                            <FieldArray
                                name="fields"
                                render={arrayHelpers => {
                                    return (
                                        <div>
                                            {Array.isArray(values?.fields) && values.fields.map((item, index) => {
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