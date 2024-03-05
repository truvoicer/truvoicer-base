import React, {useContext, useState} from 'react';
import {getListItemData} from "../../library/helpers/items";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//     },
//     heading: {
//         fontSize: theme.typography.pxToRem(15),
//         fontWeight: theme.typography.fontWeightRegular,
//     },
// }));
const ItemViewAccordion = (props) => {
    const [expanded, setExpanded] = useState(props.data.config.initialTab);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    // const classes = useStyles();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    function defaultView() {
        return (
            <div className={"item-view--accordion "}>
                {props.data.tabs.map((tabItem, index) => (
                    <Accordion
                        key={index}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        expanded={expanded === index}
                        onChange={handleChange(index)}
                    >
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography className={''}>{tabItem.label}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                        </AccordionDetails>
                    </Accordion>

                ))}
            </div>
        );
    }
    return templateManager.getTemplateComponent({
        category: 'accordions',
        templateId: 'itemViewAccordion',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            handleChange: handleChange,
            expanded: expanded,
            setExpanded: setExpanded,
            ...props
        }
    })
}
export default ItemViewAccordion;
