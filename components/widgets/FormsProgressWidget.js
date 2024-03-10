import React, {useContext, useEffect, useState} from 'react';
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import CircleProgressBar from "./ProgressBars/CircleProgressBar";
import {uCaseFirst} from "../../library/utils";
import Link from "next/link";
import {siteConfig} from "../../../config/site-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, faArrowCircleRight, faTasks} from "@fortawesome/free-solid-svg-icons";

function FormsProgressWidget(props) {
    const {data} = props;
    const [progressData, setProgressData] = useState({});
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function formProgressRequest() {
        protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.formsProgressRequest),
            {
                form_field_groups: data?.form_field_groups
            },
            false
        )
            .then(response => {
                if (response.data.status === "success" && Array.isArray(response.data.groups)) {
                    setProgressData(response.data)
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        formProgressRequest();
    }, []);
    const overallPercentage = progressData?.overallProgressPercentage;

    function defaultView() {
        return (
            <div className="row">
                <div className="col-lg-12 col-12">
                    <div className="small-box bg-info forms-progress">
                        <div className="inner">
                            <div className={"row align-items-center"}>
                                <div className={"col-12 col-md-4 col-lg-3"}>
                                    <CircleProgressBar
                                        percent={overallPercentage ? overallPercentage : 0}
                                        ringColor={"#0C89F0"}
                                        textColor={"#f40000"}
                                    />
                                </div>
                                <div className={"col-12 col-md-8 col-lg-9"}>
                                    <h3 className={"text-white"}>
                                        {parseInt(overallPercentage) < 100 ? data?.not_complete_text : data?.complete_text}
                                    </h3>
                                    <ul className={"forms-progress--list"}>
                                        {Array.isArray(progressData?.groups) && progressData.groups.map((group, index) => (
                                            <React.Fragment key={index}>
                                                {Array.isArray(group?.empty_fields) && group.empty_fields.length > 0 &&
                                                    <li key={index}>

                                                        <Link href={siteConfig.defaultUserAccountHref + "/profile"}
                                                              className={"text-white forms-progress--list--heading"}>{uCaseFirst(group?.name)}
                                                        </Link>
                                                        <ul>
                                                            {group.empty_fields.map((field, fieldIndex) => (
                                                                <li key={fieldIndex}>
                                                                    <Link
                                                                        href={siteConfig.defaultUserAccountHref + "/profile"}
                                                                        className={"text-white"}>{field?.incomplete_text}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                }
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                    <p>{data?.bottom_text}</p>
                                </div>
                            </div>
                        </div>
                        <div className="icon">
                            <FontAwesomeIcon icon={faTasks} />
                        </div>

                        <Link href={siteConfig.defaultUserAccountHref + "/profile"}
                              className="small-box-footer">
                            Edit Profile <FontAwesomeIcon icon={faArrowCircleRight} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'formsProgressWidget',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            formProgressRequest: formProgressRequest,
            progressData: progressData,
            setProgressData: setProgressData,
            ...props
        }
    });
}

export default FormsProgressWidget;
