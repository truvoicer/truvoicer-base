import React, {useState} from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {getListItemData} from "../../library/helpers/items";

const ItemViewVerticalTabList = (props) => {
    const [tabValue, setTabValue] = useState(props.data.config.initialTab);

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

    return (
        <div className={"tab-layout"}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
            >
                {props.data.tabs.map((tabItem, index) => (
                    <Tab label={tabItem.label} key={index.toString()} {...tabProps(index)} />
                ))}
            </Tabs>
            {props.data.tabs.map((tabItem, index) => (
                <TabPanel key={index.toString()} value={tabValue} index={index}>
                    <ul className={"tab-layout--list"}>
                        {tabItem.tabData.map((tabDataItem, tabDataIndex) => (
                            <li key={tabDataIndex.toString()}>
                                <div className={"tab-layout--list--row"}>
                                    <div className={"tab-layout--list--row--label"}>
                                        {tabDataItem.label}
                                    </div>
                                    <div className={"tab-layout--list--row--value"}>
                                        {getListItemData(tabDataItem, props.item)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </TabPanel>
            ))}
        </div>
    );
}
export default ItemViewVerticalTabList;
