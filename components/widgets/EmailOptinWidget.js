import React, {useContext, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {Formik} from "formik";
import {wpApiConfig} from "../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const EmailOptinWidget = (props) => {
    const {data} = props;
    const [response, setResponse] = useState({
        status: "",
        message: ""
    });
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const formResponseHandler = (status, data) => {
        if (data?.status === "success") {
            setResponse({
                status: "success",
                message: data.message
            })
        } else {
            setResponse({
                status: "error",
                message: "There was an error, please try again."
            })
        }
    }


    return (

        <div className="ts-newsletter">
            <div className="newsletter-introtext">
                <h4>{data?.heading || 'Get Updates'}</h4>
                <p>{data?.description || 'Subscribe our newsletter to get the best stories into your inbox!'}</p>
            </div>

            <div className="newsletter-form">
                {response.status === "success" &&
                    <p className={"text-success"}>{response.message}</p>
                }

                <Formik
                    initialValues={{email: ""}}
                    validate={values => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = "Email is required";
                        }
                        return errors;
                    }}
                    onSubmit={async (values, {resetForm, setSubmitting}) => {
                        const response = await wpResourceRequest({
                            endpoint: wpApiConfig.endpoints.formsRedirectPublic,
                            method: 'POST',
                            data: {
                                ...values,
                                ...{
                                    endpoint_providers: data?.endpoint_providers,
                                }
                            }
                        });
                        const responseData = await response.json();
                        console.log({responseData})
                        formResponseHandler(responseData.status, responseData.data);
                    }}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                {errors.email &&
                                    <label className={"text-danger"}>{errors.email}</label>
                                }
                                <input
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    id="newsletter-form-email"
                                    className="form-control form-control-lg"
                                    placeholder={data?.placeholder || "E-mail"}
                                    autoComplete="off"/>
                                <button className="btn btn-primary" type={"submit"}>
                                    {data?.button_text || "Subscribe"}
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
EmailOptinWidget.category = 'widgets';
EmailOptinWidget.templateId = 'emailOptinWidget';
export default EmailOptinWidget;
