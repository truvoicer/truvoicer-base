import React, {useContext, useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";
import {listingsGridConfig} from "@/truvoicer-base/config/listings-grid-config";
import {isNotEmpty, isSet} from "../../../../library/utils";
import {SESSION_USER, SESSION_USER_ID} from "../../../../redux/constants/session-constants";
import Col from "react-bootstrap/Col";
import {useRouter} from "next/navigation";
import {getGridItemColumns} from "../../../../redux/actions/item-actions";
import {siteConfig} from "@/config/site-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsGrid} from "@/truvoicer-base/library/listings/grid/listings-grid";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsEngine} from "@/truvoicer-base/library/listings/engine/listings-engine";
import {DISPLAY_AS} from "@/truvoicer-base/redux/constants/general_constants";
import {extractItemListFromPost} from "@/truvoicer-base/library/helpers/wp-helpers";
import ListingsItemsContext, {itemsContextData} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {updateStateObject} from "@/truvoicer-base/library/helpers/state-helpers";

const GridItems = ({children, ...props}) => {
    const {category} = props;

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const router = useRouter();
    const [modalData, setModalData] = useState({
        show: false,
        item: {},
        provider: ""
    });
    const [listPosition, setListPosition] = useState(null);
    // const [searchList, setSearchList] = useState([]);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const listStart = listingsContext?.listingsData?.list_start;
    const listEnd = listingsContext?.listingsData?.list_end;
    const customPosition = listingsContext?.listingsData?.custom_position;
    const listItems = searchContext?.searchList || [];

    const showInfo = (item, category, e) => {
        e.preventDefault()
        setModalData({
            show: true,
            item: item,
            provider: item.provider,
            category: category
        })
    }

    // const GetModal = () => {
    //     const gridConfig = listingsGridConfig.gridItems;
    //     if (!isSet(gridConfig[searchContext.category])) {
    //         return null
    //     }
    //     if (!isSet(gridConfig[searchContext.category].modal)) {
    //         return null;
    //     }
    //     const ItemModal = gridConfig[searchContext.category].modal;
    //     return <ItemModal data={modalData} category={searchContext.category} close={closeModal}/>
    //
    // }

    const closeModal = () => {
        setModalData({
            show: false,
            item: modalData.item,
            provider: modalData.provider,
        })
    }

    const insertListStartItems = (searchList) => {
        const itemsData = ListingsEngine.getCustomItemsData(
            ["list_start"],
            listingsManager.listingsEngine.listingsContext?.listingsData
        );
        if (itemsData.length === 0) {
            return searchList;
        }


        itemsData.map(item => {
            let itemCopy = {...item};
            searchList.unshift(itemCopy)
        })
        return searchList;
    }

    const insertListEndItems = (searchList) => {
        const itemsData = ListingsEngine.getCustomItemsData(
            ["list_end"],
            listingsManager.listingsEngine.listingsContext?.listingsData
        );
        if (itemsData.length === 0) {
            return searchList;
        }


        itemsData.map(item => {
            let itemCopy = {...item};
            searchList.push(itemCopy)
        })
        return searchList;
    }

    const insertCustomPositionItems = (searchList) => {
        const listingsData = listingsContext.listingsData;
        if (!isNotEmpty(listingsData.insert_index) || isNaN(listingsData.insert_index)) {
            return searchList;
        }
        if (!isNotEmpty(listingsData.per_page_count) || isNaN(listingsData.per_page_count)) {
            return searchList;
        }

        const listStartItemsCount = ListingsEngine.getCustomItemsData(
            ["list_start"],
            listingsManager.listingsEngine.listingsContext?.listingsData
        ).length;

        let itemsData = ListingsEngine.getCustomItemsData(
            ["custom_position"],
            listingsManager.listingsEngine.listingsContext?.listingsData
        );
        const newSearchList = [];
        const newItemsData = [];
        if (itemsData.length === 0) {
            return searchList;
        }

        itemsData.map(item => {
            let itemCopy = {...item};
            newItemsData.push(itemCopy);
        });
        let insertCount = 0 - listStartItemsCount;
        let insertItemCount = 0;
        searchList.map((item) => {
            if (
                (insertCount % parseInt(listingsData.insert_index)) === 0 &&
                insertItemCount < parseInt(listingsData.per_page_count)
            ) {
                newSearchList.push(...newItemsData);
                insertItemCount++;
            }
            newSearchList.push(item)
            insertCount++;
        })
        return newSearchList;
    }

    useEffect(() => {

        if (listStart) {
            setListPosition("list_start")
        }
        if (listEnd) {
            setListPosition("list_end")
        }
        if (customPosition) {
            setListPosition("custom_position")
        }

    }, [
        listStart,
        listEnd,
        customPosition,
    ])

    function getSearchList() {
        let searchList = [...listItems];
        if (
            !listStart &&
            !listEnd &&
            !customPosition
        ) {
            return searchList;
        }
        if (listStart) {
            searchList = insertListStartItems(searchList);
        }
        if (listEnd) {
            searchList = insertListEndItems(searchList)
        }
        if (customPosition) {
            searchList = insertCustomPositionItems(searchList)
        }
        return searchList;
    }
    const [itemsContextState, setItemsContextState] = useState({
        ...itemsContextData,
        labels: searchContext?.labels || {},
        updateData: ({key, value}) => {
            updateStateObject({
                key,
                value,
                setStateObj: setItemsContextState
            })
        },
    });

    useEffect(() => {
        setItemsContextState({
            ...itemsContextState,
            labels: searchContext?.labels || {}
        })
    }, [searchContext?.labels])
    useEffect(() => {
        console.log('griditems listItems', listItems)
        updateStateObject({
            key: 'items',
            value: getSearchList(),
            setStateObj: setItemsContextState
        })
    }, [
        listItems,
        listPosition,
    ])
        return (
            <ListingsItemsContext.Provider value={itemsContextState}>
                {children}
                {/*{modalData.show &&*/}
                {/*    <GetModal/>*/}
                {/*}*/}
            </ListingsItemsContext.Provider>
        )
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}
GridItems.category = 'listings';
GridItems.templateId = 'gridItems';
export default connect(
    mapStateToProps,
    null
)(GridItems);
