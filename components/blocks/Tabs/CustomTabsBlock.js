import React, {useContext} from "react";
import {connect} from "react-redux";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import EditorContent from "../../../../truvoicer-base/components/widgets/EditorContent";
// import CustomItemsCarousel from "../Carousel/CustomItemsCarousel";
import PersonalForm from "../../User/Profile/Forms/PersonalForm";
import ExperiencesForm from "../../User/Profile/Forms/ExperiencesForm";
import SkillsForm from "../../User/Profile/Forms/SkillsForm";
import CvForm from "../../User/Profile/Forms/CVForm";
import EducationForm from "../../User/Profile/Forms/EducationForm";
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import CarouselInterface from "@/truvoicer-base/components/blocks/carousel/CarouselInterface";

const CustomTabsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getForm = (tab) => {
        let FormComponent = null;
        switch (tab.form_block?.form_id) {
            case "user_personal":
                FormComponent = PersonalForm;
                break
            case "experiences":
                FormComponent = ExperiencesForm;
                break;
            case "skills":
                FormComponent = SkillsForm;
                break;
            case "cv":
                FormComponent = CvForm;
                break;
            case "education":
                FormComponent = EducationForm;
                break;
            default:
                return null
        }
        if (!FormComponent) {
            return null
        }
        if (props.data?.access_control === 'protected') {
            return templateManager.render(<UserAccountLoader>
                    {templateManager.render(<FormComponent data={tab}/>)}
                </UserAccountLoader>
            )
        }
        return templateManager.render(<FormComponent data={tab}/>)
    }

    const getTabContent = (tab) => {
        switch (tab.custom_tabs_type) {
            case "custom_carousel":
                return templateManager.render(<CarouselInterface data={tab?.carousel_block}/>);
            case "form":
                return getForm(tab)
            case "custom_content":
                return (
                    <div className={"container"}>
                        <div className={"custom_content"}>
                            {templateManager.render(<EditorContent data={tab.custom_content}/>)}
                        </div>
                    </div>
                )
        }
    }

    const getDefaultActiveTab = () => {
        let tabIndex = 0;
        if (!Array.isArray(props.data.tabs)) {
            return tabIndex;
        }
        props.data.tabs.map((tab, index) => {
            if (tab?.default_active_tab) {
                tabIndex = index
            }
        });
        return tabIndex;
    }

    return (
        <>
            <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={getDefaultActiveTab()}
            >
                <div className="container">
                    {isNotEmpty(props?.data?.heading) &&
                        <div className="row">
                            <div className="col-12">
                                {props?.data?.heading &&
                                    <h2 className="section-title mb-70 wow fadeInUp" data-wow-delay="100ms">
                                        {props?.data?.heading}
                                    </h2>
                                }
                                {props?.data?.sub_heading &&
                                    <p>{props?.data?.sub_heading}</p>
                                }
                            </div>
                        </div>
                    }
                    {Array.isArray(props.data.tabs) &&
                        <>
                            {props?.data?.tabs_orientation === "vertical"
                                ?
                                <div className="row">
                                    <div className="col-2">
                                        <Nav
                                            variant="pills"
                                            className="flex-column"
                                        >
                                            {props.data.tabs.map((tab, index) => (
                                                <Nav.Item key={index}>
                                                    <Nav.Link
                                                        eventKey={index}>{tab?.tab_heading || `Tab ${index}`}</Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </div>
                                    <div className="col-10">
                                        <Tab.Content className={"wow fadeInUp"}>
                                            {props.data.tabs.map((tab, index) => (
                                                <Tab.Pane eventKey={index} key={index}>
                                                    {getTabContent(tab)}
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </div>
                                </div>
                                :
                                <>
                                    <div className="row">
                                        <div className="col-12">
                                            <Nav
                                                variant="tabs"
                                                className="wow fadeInUp"
                                            >
                                                {props.data.tabs.map((tab, index) => (
                                                    <Nav.Item key={index}>
                                                        <Nav.Link
                                                            eventKey={index}>{tab?.tab_heading || `Tab ${index}`}</Nav.Link>
                                                    </Nav.Item>
                                                ))}
                                            </Nav>
                                        </div>
                                    </div>
                                    <Tab.Content className={"wow fadeInUp"}>
                                        {props.data.tabs.map((tab, index) => (
                                            <Tab.Pane eventKey={index} key={index}>
                                                {getTabContent(tab)}
                                            </Tab.Pane>
                                        ))}
                                    </Tab.Content>
                                </>
                            }
                        </>
                    }
                </div>
            </Tab.Container>
        </>
    );
}

function mapStateToProps(state) {
    return {
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

CustomTabsBlock.category = 'public';
CustomTabsBlock.templateId = 'customTabsBlock';
export default connect(
    mapStateToProps
)(CustomTabsBlock);
