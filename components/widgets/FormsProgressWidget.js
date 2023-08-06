import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import CircleProgressBar from "./ProgressBars/CircleProgressBar";
import {uCaseFirst} from "../../library/utils";
import Link from "next/link";
import {siteConfig} from "../../../config/site-config";

function FormsProgressWidget({data}) {
    const [progressData, setProgressData] = useState({});
    useEffect(() => {
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
    }, []);
    const overallPercentage = progressData?.overallProgressPercentage;
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
                                                            <Link href={siteConfig.defaultUserAccountHref + "/profile"}
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
                        <i className="fas fa-tasks"/>
                    </div>

                    <Link href={siteConfig.defaultUserAccountHref + "/profile"}
                         className="small-box-footer">
                            Edit Profile <i className="fas fa-arrow-circle-right"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FormsProgressWidget;
