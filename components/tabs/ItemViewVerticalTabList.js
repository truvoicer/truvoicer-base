import React, {useContext, useState} from 'react';
import {getListItemData} from "../../library/helpers/items";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ItemViewVerticalTabList = (props) => {
    const [tabValue, setTabValue] = useState(props.data.config.initialTab);
    const templateManager = new TemplateManager(useContext(TemplateContext));

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
                                        {getListItemData(tabDataItem, props.item, templateManager)}
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
ItemViewVerticalTabList.category = 'tabs';
ItemViewVerticalTabList.templateId = 'itemViewVerticalTabList';
export default ItemViewVerticalTabList;
