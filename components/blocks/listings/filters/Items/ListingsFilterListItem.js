import React, {useContext, useEffect} from "react";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {
    SEARCH_REQUEST_APPEND,
    SEARCH_REQUEST_NEW,
    SEARCH_STATUS_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {buildFilterList} from "@/truvoicer-base/library/helpers/wp-helpers";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterListItem = (props) => {
    const {listingsContextGroup} = props;

    const listingsContext = listingsContextGroup?.listingsContext;
    const searchContext = listingsContextGroup?.searchContext;

    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const formChangeHandler = (e) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterListItem');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        if (e.target.checked) {
            listingsManager.getSearchEngine().addItemToQueryArray(props.data.name, e.target.value, true)
        } else {
            listingsManager.getSearchEngine().removeItemFromQueryArray(props.data.name, e.target.value, true)
        }
    }

    const filterList = buildFilterList(props?.data?.filter_list_id)

    // useEffect(() => {
    //     if (
    //         searchContext?.searchStatus !== SEARCH_STATUS_STARTED &&
    //         searchContext?.searchOperation === SEARCH_REQUEST_NEW &&
    //         searchContext?.searchEntity === 'listingsFilterListItem'
    //     ) {
    //         listingsManager.runSearch('listingsFilterListItem');
    //     }
    // }, [searchContext?.searchOperation]);

    return (
        <>
            <ul className="list-unstyled mb-0">
                {props.data.source === "wordpress" &&
                    filterList.map((item, index) => (

                        <li key={"list_control_" + index.toString()}>
                            <Form.Check
                                type={"checkbox"}
                                label={item.label}
                                id={props.controlPrefix + item.name}
                                name={props.data.name + "[]"}
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

ListingsFilterListItem.category = 'listings';
ListingsFilterListItem.templateId = 'listingsFilterListItem';
export default connect(
    mapStateToProps,
    null
)(ListingsFilterListItem);
