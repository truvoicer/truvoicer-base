import React, {useContext, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {
    NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterApiListItem = (props) => {
    const [listItems, setListItems] = useState([]);

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getListItemsCallback = (status, data) => {
        if (status === 200) {
            setListItems(data.data)
        } else {
            console.error(data)
        }
    }
    useEffect(() => {
        let isCancelled = false;
        if (listingsContext?.category !== "") {
            listingsManager.listingsEngine.getListingsProviders(listingsContext?.listingsData, props.data.api_endpoint, getListItemsCallback)

            return () => {
                isCancelled = true;
            };
        }
    }, [])

    const formChangeHandler = (e) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterApiListItem');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        if (e.target.checked) {
            listingsManager.getListingsEngine().addArrayItem(props.data.api_endpoint, e.target.value, true)
        } else {
            listingsManager.getListingsEngine().removeArrayItem(props.data.api_endpoint, e.target.value, true)
        }
    }

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST &&
            searchContext?.searchEntity === 'listingsFilterApiListItem'
        ) {
            listingsManager.runSearch('listingsFilterApiListItem');
        }
    }, [searchContext?.searchOperation]);
    function defaultView() {
        return (
            <div className="single_field">
                <label className="widget-title">{props.data.label}</label>
                <ul className="">
                    {listItems &&
                        listItems.map((item, index) => (
                            <li key={"api_list_control_" + index.toString()}>
                                <Form.Check
                                    type={"checkbox"}
                                    label={item.provider_label}
                                    id={props.controlPrefix + item.provider_name}
                                    name={props.data.api_endpoint + "[]"}
                                    value={item.provider_name}
                                    onChange={formChangeHandler}
                                />
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'listings',
        templateId: 'listingsFilterApiListItem',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            getListItemsCallback: getListItemsCallback,
            listItems: listItems,
            setListItems: setListItems,
            formChangeHandler: formChangeHandler,
            ...props
        }
    })
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
    null
)(ListingsFilterApiListItem);
