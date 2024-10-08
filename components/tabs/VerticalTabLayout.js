import React, {useContext, useState} from 'react';
import {isSet} from "../../library/utils";
import {blockComponentsConfig} from "../../config/block-components-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {Tabs, Tab} from "react-bootstrap";

const VerticalTabLayout = (props) => {
    const [tabValue, setTabValue] = useState(props.tabIndex);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const handleTabChange = (e, value) => {
        setTabValue(value)
    }
    // const useStyles = makeStyles((theme) => ({
    //     root: {
    //         flexGrow: 1,
    //         backgroundColor: theme.palette.background.paper,
    //         display: 'flex',
    //         minHeight: "100vh",
    //     },
    //     tabs: {
    //         borderRight: `1px solid ${theme.palette.divider}`,
    //         backgroundImage: `url(${props.tabsBgImage})`
    //     },
    // }));

    const tabProps = (index) => {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    const TabPanel = (props) => {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                className={"vertical-tabs--panel"}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <>
                        {children}
                    </>
                )}
            </div>
        );
    }

    const getTabComponent = (tabValue) => {
        const tabItem = props.data[tabValue];
        if (isSet(blockComponentsConfig.components[tabItem.tab_component])) {
            const TabComponent = blockComponentsConfig.components[tabItem.tab_component].component;
            return <TabComponent data={tabItem}/>
        }
        return null
    }

    console.log(props);

    return (
        <div className={''}>
            <Tabs
                orientation="vertical"
                defaultActiveKey={tabValue}
                onChange={handleTabChange}
                aria-label="simple tabs example"
                className={"vertical-tabs "}
            >
                {props.data.map((tabItem, index) => (
                    <Tab
                        className={"vertical-tabs--tab"}
                        key={index}
                        eventKey={index.toString()}
                        label={tabItem.tab_label}
                        {...tabProps(index)}>

                        {getTabComponent(tabValue)}
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
VerticalTabLayout.category = 'tabs';
VerticalTabLayout.templateId = 'verticalTabLayout';
export default VerticalTabLayout;
