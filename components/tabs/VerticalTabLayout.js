import React, {useContext, useState} from 'react';
import {isSet} from "../../library/utils";
import {blockComponentsConfig} from "../../config/block-components-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Tab from "react-bootstrap/Tab";
import {Tabs} from "react-bootstrap";

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
                    <Box p={3}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    const getTabComponent = (tabValue) => {
        const tabItem = props.data[tabValue];
        if (isSet(blockComponentsConfig.components[tabItem.tab_component])) {
            const TabComponent = blockComponentsConfig.components[tabItem.tab_component].component;
            return <TabComponent data={tabItem} />
        }
        return null
    }

    // const classes = useStyles();

        return (
            <div className={''}>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="simple tabs example"
                    className={"vertical-tabs "}
                >
                    {props.data.map((tabItem, index) => (
                        <Tab
                            className={"vertical-tabs--tab"}
                            key={index.toString()}
                            label={tabItem.tab_label}
                            {...tabProps(index)}
                        />
                    ))}
                </Tabs>
                {props.data.map((tabItem, index) => (
                    <TabPanel
                        key={index.toString()}
                        value={tabValue}
                        index={index}
                    >
                        {getTabComponent(tabValue)}
                    </TabPanel>
                ))}
            </div>
        );
}
VerticalTabLayout.category = 'tabs';
VerticalTabLayout.templateId = 'verticalTabLayout';
export default VerticalTabLayout;
