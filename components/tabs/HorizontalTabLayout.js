import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import {isSet} from "../../library/utils";
import {blockComponentsConfig} from "../../config/block-components-config";

const HorizontalTabLayout = (props) => {
    const [tabValue, setTabValue] = useState(props.tabIndex);

    const handleTabChange = (e, value) => {
        setTabValue(value)
    }

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
                className={"tab-layout--vertical-panel"}
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

    return (
        <div>
            <AppBar position="static">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="simple tabs example"
                >
                    {props.data.map((tabItem, index) => (
                        <Tab
                            key={index.toString()}
                            label={tabItem.tab_label}
                            {...tabProps(index)}
                        />
                    ))}
                </Tabs>
            </AppBar>
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
export default HorizontalTabLayout;
