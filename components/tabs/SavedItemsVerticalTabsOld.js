import React, {useContext, useEffect, useState} from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {convertImageObjectsToArray, isSet} from "../../library/utils";
import {defaultListingsGrid, listingsGridConfig} from "@/config/listings-grid-config";
import {
    LISTINGS_GRID_COMPACT,
    LISTINGS_GRID_DETAILED,
    LISTINGS_GRID_LIST
} from "../../redux/constants/listings-constants";
import {fetchData} from "../../library/api/fetcher/middleware";
import Grid from "@mui/material/Grid";
import {getItemRatingDataAction, isSavedItemAction} from "../../redux/actions/user-stored-items-actions";
import {SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {connect} from "react-redux";
// import makeStyles from "@mui/material/styles/makeStyles";
import {useRouter} from "next/router";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";

const SavedItemsVerticalTabsOld = (props) => {
    const listingsContext = useContext(ListingsContext);
    const router = useRouter();
    const listingsGrid = isSet(defaultListingsGrid)? defaultListingsGrid : listingsContext.listingsGrid;
    const [modalData, setModalData] = useState({
        show: false,
        item: {},
        provider: ""
    });

    const getItemByIndex = (index) => {
        let item = {};
        Object.keys(props.data).map((key, objectIndex) => {
            if (index === objectIndex) {
                item = props.data[key];
            }
        })
        return item;
    }

    const getItemsRequest = (provider_name, new_request = true) => {
        props.data[provider_name]?.items?.map((item) => {
            let data = {
                query: item.item_id,
                provider: item.provider_name,
                category: item.category
            }
            console.log(data)
            fetchData("operation", ["single"], data)
                .then((response) => {
                    if (response.status === 200) {
                        getItemsResponseHandler(response.data, new_request);
                        new_request = false;
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }

    const handleTabChange = (e, value) => {
        console.log(value)
        setTabValue(value)
        getItemsRequest(value, true);
    }


    const getItemsResponseHandler = (data, new_request) => {
        let itemData = data.request_data[0];
        let getPanelData = {...panelData};
        itemData.category = data.category;
        if (new_request) {
            getPanelData[itemData.provider].items_response.splice(
                0,
                getPanelData[itemData.provider].items_response.length + 1
            )
        }
        getPanelData[itemData.provider].items_response.push(itemData);
        setPanelData(getPanelData);
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

    const saveItemRequestCallback = (error, data) => {
        console.log(error, data)
    }

    const showInfo = (item, category, e) => {
        e.preventDefault()

        // const url = getItemViewUrl(item, category)
        // router.push(url, url, { shallow: true });
        setModalData({
            show: true,
            item: item,
            provider: item.provider
        })
    }

    const GetModal = (category) => {
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[category])) {
            return null
        }
        if (!isSet(gridConfig[category].modal)) {
            return null;
        }
        const ItemModal = gridConfig[category].modal;
        return <ItemModal data={modalData} category={category} close={closeModal}/>

    }

    const closeModal = () => {
        setModalData({
            show: false,
            item: modalData.item,
            provider: modalData.provider,
        })
    }
    const getGridItem = (item, category) => {
        let gridItem = {...item};
        // console.log(item, category)
        if (isSet(gridItem.image_list)) {
            gridItem.image_list = convertImageObjectsToArray(gridItem.image_list);
        }
        const gridConfig = listingsGridConfig.gridItems;
        if (!isSet(gridConfig[category])) {
            return null;
        }
        if (!isSet(gridConfig[category][listingsGrid])) {
            return null;
        }
        const GridItems = gridConfig[category][listingsGrid];
        return <GridItems data={gridItem}
                          searchCategory={category}
                          showInfoCallback={showInfo}
                          savedItem={
                              isSavedItemAction(
                                  gridItem.item_id,
                                  gridItem.provider,
                                  category,
                                  props.user[SESSION_USER_ID]
                              )
                          }
                          ratingsData={
                              getItemRatingDataAction(
                                  gridItem.item_id,
                                  gridItem.provider,
                                  category,
                                  props.user[SESSION_USER_ID]
                              )
                          }
        />
    }

    const getItemList = (data) => {
        let gridItemSize = 12;
        switch (listingsGrid) {
            case LISTINGS_GRID_COMPACT:
                gridItemSize = 4;
                break;
            case LISTINGS_GRID_LIST:
                gridItemSize = 12;
                break;
            case LISTINGS_GRID_DETAILED:
                gridItemSize = 6;
                break;
        }
        return (
            <Grid container className={""} spacing={2}>
                {isSet(data) &&
                data.items_response.map((item, index) => (
                    <Grid item xs={gridItemSize} key={index}>
                        {getGridItem(item, item.category)}
                    </Grid>
                ))
                }
            </Grid>
        )
    }
    // const useStyles = makeStyles((theme) => ({
    //     root: {
    //         flexGrow: 1,
    //         backgroundColor: theme.palette.background.paper,
    //         display: 'flex',
    //         height: 224,
    //         overflow: "visible"
    //     },
    //     tabs: {
    //         borderRight: `1px solid ${theme.palette.divider}`,
    //         overflowX: 'visible',
    //         overflow: "visible"
    //     },
    // }));

    // const classes = useStyles();
    const [tabValue, setTabValue] = useState(getItemByIndex(0).name);
    const [panelData, setPanelData] = useState({...props.data});

    useEffect(() => {
        getItemsRequest(getItemByIndex(0).name, true)
    }, [])

    return (
        <div className={"tab-layout"}>
            <Tabs
                // action={getItemsRequest(getItemByIndex(0).name, true)}
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                // className={classes.tabs}
            >
                {Object.keys(props.data).map((itemKey, index) => (
                    <Tab
                        label={props.data[itemKey].label}
                        key={index.toString()}
                        value={itemKey}
                        {...tabProps(index)} />
                ))}
            </Tabs>
            {Object.keys(props.data).map((itemKey, tabDataIndex) => (
                <React.Fragment key={tabDataIndex.toString()}>
                <TabPanel
                    value={tabValue}
                    index={itemKey}
                    className={"tab-layout--panel" +
                    ""}
                >
                    {getItemList(panelData[itemKey])}
                </TabPanel>
                {modalData.show &&
                    GetModal(panelData[itemKey].category)
                }
                </React.Fragment>
            ))}

        </div>
    );
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER]
    };
}

export default connect(
    mapStateToProps,
    null
)(SavedItemsVerticalTabsOld);
