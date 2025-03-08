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
import WpDataLoader from "@/truvoicer-base/components/loaders/WpDataLoader";
import {isNotEmpty, isObject} from "@/truvoicer-base/library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import CarouselInterface from "@/truvoicer-base/components/blocks/carousel/CarouselInterface";
import FormBlock from "@/truvoicer-base/components/blocks/form/FormBlock";

const CustomTabsBlock = (props) => {
    const {data, defaultActiveKey, onSelect = () => {}} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getTabContent = (tab) => {
        switch (tab.custom_tabs_type) {
            case "custom_carousel":
                return templateManager.render(<CarouselInterface data={tab?.carousel_block}/>);
            case "form":
                if (!isObject(tab?.form_block)) {
                    return null;
                }
                return templateManager.render(<FormBlock data={tab.form_block}/>)
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

    return (
        <>
            <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={defaultActiveKey}
                onSelect={onSelect}
            >
                <div className="container section-block">
                    {isNotEmpty(props?.data?.heading) &&
                        <div className="row">
                            <div className="col-12">
                                <div className="featured-tab color-blue">
                                    <h3 className="block-title"><span>{props?.data?.heading || 'Edit profile'}</span></h3>
                                {/*{props?.data?.heading &&*/}
                                {/*    <h2 className="section-title mb-70 wow fadeInUp" data-wow-delay="100ms">*/}
                                {/*        {props?.data?.heading}*/}
                                {/*    </h2>*/}
                                {/*}*/}
                                {props?.data?.sub_heading &&
                                    <p>{props?.data?.sub_heading}</p>
                                }
                            </div>
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
