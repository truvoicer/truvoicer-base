import React, {useContext, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {Formik} from "formik";
import {responseHandler} from "../../library/api/fetcher/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const EmailOptinWidget = ({data}) => {
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

    function defaultView() {
    return (
        <aside className="single_sidebar_widget newsletter_widget">
            <h4 className="widget_title">{data?.title || "Newsletter"}</h4>
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
                onSubmit={(values, {resetForm, setSubmitting}) => {
                    publicApiRequest(
                        buildWpApiUrl(wpApiConfig.endpoints.formsRedirectPublic),
                        {
                            ...values,
                            ...{
                                endpoint_providers: data?.endpoint_providers,
                            }
                        },
                        formResponseHandler,
                        "post"
                    );
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
                                type="email"
                                className="form-control"
                                name={"email"}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={data?.placeholder || "Enter your email"}
                                required
                            />
                        </div>
                        <button
                            className="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                            type="submit"
                        >
                            {data?.button_label || "Subscribe"}
                        </button>
                    </form>
                )}
            </Formik>
        </aside>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}

export default EmailOptinWidget;
