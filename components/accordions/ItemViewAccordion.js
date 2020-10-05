import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import HtmlParser from "react-html-parser";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getListItemData} from "../../library/helpers/items";
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));
const ItemViewAccordion = (props) => {
    const [expanded, setExpanded] = useState(props.data.config.initialTab);
    const classes = useStyles();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    return (
        <div className={"item-view--accordion " + classes.root}>
            {props.data.tabs.map((tabItem, index) => (
            <Accordion
                key={index}
                aria-controls="panel1a-content"
                id="panel1a-header"
                expanded={expanded === index}
                onChange={handleChange(index)}
            >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography className={classes.heading}>{tabItem.label}</Typography>
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
export default ItemViewAccordion;
