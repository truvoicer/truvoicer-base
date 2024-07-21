import React, {useContext, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {
    SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterApiListItem = (props) => {

    const {listingsContextGroup} = props;
    const [listItems, setListItems] = useState([]);
    const listingsContext = listingsContextGroup?.listingsContext;
    const searchContext = listingsContextGroup?.searchContext;
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getListItemsCallback = (status, data) => {
        if (status === 'success') {
            setListItems(data)
        } else {
            console.error(data)
        }
    }
    useEffect(() => {
        if (props.data.source !== 'api') {
            return;
        }
        let isCancelled = false;
        if (listingsContext?.category !== "") {
            listingsManager.getListingsProviders(listingsContext?.listingsData, props.data.api_endpoint, getListItemsCallback)

            return () => {
                isCancelled = true;
            };
        }
    }, [props.data.source])
    function getKey() {
        switch (props.data.source) {
            case 'api':
                return props.data.api_endpoint;
            case 'providers':
                return 'provider';
            default:
                console.warn('No source provided for ListingsFilterApiListItem');
                return null;
        }
    }

    const formChangeHandler = (e) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterApiListItem');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        let key = getKey();
        if (!key) {
            return;
        }

        const findProvider = listingsContext.providers.find(item => item?.name === e.target.value);
        if (findProvider) {
            return;
        }
        if (e.target.checked) {
            listingsManager.getSearchEngine().addItemToQueryArray(key, findProvider, true)
        } else {
            listingsManager.getSearchEngine().removeObjectFromQueryArray(key, 'name',  e.target.value, true)
        }
    }

    function getListItems() {
        switch (props.data.source) {
            case 'api':
                return listItems;
            case 'providers':
                return listingsContext.providers;
            default:
                console.warn('No source provided for ListingsFilterApiListItem');
                return [];
        }
    }

    // useEffect(() => {
    //     if (
    //         searchContext?.searchStatus !== SEARCH_STATUS_STARTED &&
    //         searchContext?.searchOperation === SEARCH_REQUEST_NEW &&
    //         searchContext?.searchEntity === 'listingsFilterApiListItem'
    //     ) {
    //         listingsManager.runSearch('listingsFilterApiListItem');
    //     }
    // }, [searchContext?.searchOperation]);

    const items = getListItems();
    let key = getKey();

    return (
        <>
            <ul className="list-unstyled">
                {Array.isArray(items) &&
                    items.map((item, index) => (
                        <li key={"api_list_control_" + index.toString()}>
                            <Form.Check
                                type={"checkbox"}
                                label={item.label}
                                id={props.controlPrefix + item.name}
                                name={key + "[]"}
                                value={item.name}
                                onChange={formChangeHandler}
                            />
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

function mapStateToProps(state) {
    return {};
}

ListingsFilterApiListItem.category = 'listings';
ListingsFilterApiListItem.templateId = 'listingsFilterApiListItem';

export default connect(
    mapStateToProps,
    null
)(ListingsFilterApiListItem);
