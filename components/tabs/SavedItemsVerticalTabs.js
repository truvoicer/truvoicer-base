import React, {useContext, useEffect, useState} from 'react';
import {isNotEmpty, isSet} from "../../library/utils";
import {defaultListingsGrid, listingsGridConfig} from "../../config/listings-grid-config";
import {fetchData} from "../../library/api/fetcher/middleware";
import {SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {connect} from "react-redux";
import {useRouter} from "next/navigation";
import {getGridItemColumns, getItemViewUrl} from "../../redux/actions/item-actions";
import {filterItemIdDataType} from "../../library/helpers/items";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {siteConfig} from "../../../config/site-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";


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

const SavedItemsVerticalTabs = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const router = useRouter();
    const listingsGrid = isSet(defaultListingsGrid) ? defaultListingsGrid : listingsContext.listingsGrid;
    listingsGrid.setKeyMap(listingsContext?.listingsData?.keymap);
    const [modalData, setModalData] = useState({
        show: false,
        item: {},
        provider: ""
    });

    const listingsGridManager = new ListingsGrid();
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const getProviderDataByName = (index) => {
        let item = {};
        Object.keys(props.data).map((key, objectIndex) => {
            if (index === objectIndex) {
                item = props.data[key];
            }
        })
        return item;
    }

    const getItemsRequest = (provider_name, new_request = true) => {
        props.data[provider_name]?.items?.map(async (item) => {
            let data = {
                query: item.item_id,
                provider: item.provider_name,
                category: item.category
            }

            const response = await fetchData("operation", ["single"], data);
            if (response.status === 200) {
                getItemsResponseHandler(response.data, new_request);
                new_request = false;
            }
        })
    }

    const handleTabChange = (e, value) => {
        setTabValue(value)
        if (!Array.isArray(panelData[value]?.items_response) || panelData[value]?.items_response.length === 0) {
            getItemsRequest(value, true);
        }
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

    const showInfo = (item, category, e) => {
        e.preventDefault()

        const url = getItemViewUrl(item, category);
        router.push(url, url)

        // setModalData({
        //     show: true,
        //     item: item,
        //     provider: item.provider
        // })
    }

    // const GetModal = (category) => {
    //     const gridConfig = listingsGridConfig.gridItems;
    //     if (!isSet(gridConfig[category])) {
    //         return null
    //     }
    //     if (!isSet(gridConfig[category].modal)) {
    //         return null;
    //     }
    //     const ItemModal = gridConfig[category].modal;
    //     return <ItemModal data={modalData} category={category} close={closeModal}/>
    //
    // }

    const closeModal = () => {
        setModalData({
            show: false,
            item: modalData.item,
            provider: modalData.provider,
        })
    }

    const getItemList = (data) => {
        return (
            <Row>
                {isSet(data) &&
                    data.items_response.map((item, index) => (
                        <Col key={index} {...getGridItemColumns(listingsGrid)}>
                            {listingsGridManager.getGridItem({
                                item,
                                displayAs: listingsContext?.listingsData?.[DISPLAY_AS],
                                category: item.category,
                                listingsGrid,
                                userId: props.user[SESSION_USER_ID],
                                index
                            })}
                        </Col>
                    ))
                }
            </Row>
        )
    }

    // const classes = useStyles();
    const [tabValue, setTabValue] = useState(getProviderDataByName(0).name);
    const [panelData, setPanelData] = useState({...props.data});

    const getItemById = (itemId, dataArray) => {
        if (!Array.isArray(dataArray) || !isNotEmpty(itemId)) {
            return [];
        }
        return dataArray.filter(item => {
            return filterItemIdDataType(item.item_id) === filterItemIdDataType(itemId)
        });
    }

    const getItemIndexByItemId = (itemId, dataArray) => {
        if (!Array.isArray(dataArray) || !isNotEmpty(itemId)) {
            return null;
        }
        let index = null;
        dataArray.map((item, objectIndex) => {
            if (filterItemIdDataType(item.item_id) === filterItemIdDataType(itemId)) {
                index = objectIndex
            }
        })
        return index;
    }

    useEffect(() => {
        if (getProviderDataByName(0).name !== siteConfig.internalProviderName) {
            getItemsRequest(getProviderDataByName(0).name, true)
        }
    }, [])

    useEffect(() => {
        setPanelData(panelData => {
            let clonePanelData = {...panelData};
            Object.keys(panelData).map((key, index) => {
                panelData[key].items_response.map(panelItem => {
                    const dataItemResponse = getItemById(panelItem.item_id, props?.data[key]?.items);
                    if (dataItemResponse.length === 0) {
                        const panelItemResponseIndex = getItemIndexByItemId(panelItem.item_id, clonePanelData[key].items_response);
                        const panelItemsIndex = getItemIndexByItemId(panelItem.item_id, clonePanelData[key].items);
                        clonePanelData[key].items_response.splice(panelItemResponseIndex, 1)
                        clonePanelData[key].items.splice(panelItemsIndex, 1)
                    }
                })
            })
            return clonePanelData;
        })
    }, [props.data])


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
                    {/*{modalData.show &&*/}
                    {/*    GetModal(panelData[itemKey].category)*/}
                    {/*}*/}
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

SavedItemsVerticalTabs.category = 'tabs';
SavedItemsVerticalTabs.templateId = 'savedItemsVerticalTabs';

export default connect(
    mapStateToProps,
    null
)(SavedItemsVerticalTabs);
