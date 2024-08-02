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
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";

function FormsProgressWidget(props) {
    const {data} = props;
    const [progressData, setProgressData] = useState({});
    const templateManager = new TemplateManager(useContext(TemplateContext));

    async function formProgressRequest() {
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.formsProgressRequest),
            {
                form_field_groups: data?.form_field_groups
            },
            false
        )
        if (response.status === "success" && Array.isArray(response.groups)) {
            setProgressData(response)
        }
    }

    useEffect(() => {
        formProgressRequest();
    }, []);
    const overallPercentage = progressData?.overallProgressPercentage;


    function renderWidget() {
        return (
            <div className="row">
                <div className="col-lg-12 col-12">
                    <div className="featured-tab color-blue">
                        <h3 className="block-title"><span>{data?.heading || 'Progress'}</span></h3>
                        <div className="inner">
                            <div className={"d-flex align-items-center justify-content-start"}>
                                <div className={""}>
                                    {templateManager.render(<CircleProgressBar
                                        percent={overallPercentage ? overallPercentage : 0}
                                        ringColor={"#0C89F0"}
                                        textColor={"#f40000"}
                                    />)}
                                </div>
                                <div className={""}>
                                    <h3 className={""}>
                                        {parseInt(overallPercentage) < 100 ? data?.not_complete_text : data?.complete_text}
                                    </h3>
                                    <ul className={"forms-progress--list"}>
                                        {Array.isArray(progressData?.groups) && progressData.groups.map((group, index) => (
                                            <React.Fragment key={index}>
                                                {Array.isArray(group?.empty_fields) && group.empty_fields.length > 0 &&
                                                    <>
                                                        {group.empty_fields.map((field, fieldIndex) => (
                                                            <li key={fieldIndex}>
                                                                <Link
                                                                    href={siteConfig.defaultUserAccountHref + "/profile"}
                                                                    className={""}>{field?.incomplete_text}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </>
                                                }
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                    <p>{data?.bottom_text}</p>
                                </div>
                            </div>
                        </div>
                        <div className="icon">
                            <FontAwesomeIcon icon={faTasks}/>
                        </div>

                        <Link href={siteConfig.defaultUserAccountHref + "/profile"}
                              className="small-box-footer">
                            Edit Profile <FontAwesomeIcon icon={faArrowCircleRight}/>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            {data?.access_control === 'protected'
                ? (
                    <UserAccountLoader
                        fields={UserAccountHelpers.getFields()}
                    >
                        {renderWidget()}
                    </UserAccountLoader>
                )
                : renderWidget()
            }
        </>
    );
}

FormsProgressWidget.category = 'widgets';
FormsProgressWidget.templateId = 'formsProgressWidget';
export default FormsProgressWidget;
