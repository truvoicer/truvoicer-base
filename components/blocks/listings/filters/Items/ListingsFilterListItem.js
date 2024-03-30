import React, {useContext, useEffect} from "react";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {
    APPEND_SEARCH_REQUEST,
    NEW_SEARCH_REQUEST,
    SEARCH_REQUEST_STARTED
} from "@/truvoicer-base/redux/constants/search-constants";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {buildFilterList} from "@/truvoicer-base/library/helpers/wp-helpers";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterListItem = (props) => {
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const formChangeHandler = (e) => {
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterListItem');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        if (e.target.checked) {
            listingsManager.getListingsEngine().addArrayItem(props.data.name, e.target.value, true)
        } else {
            listingsManager.getListingsEngine().removeArrayItem(props.data.name, e.target.value, true)
        }
    }
    const filterList = buildFilterList(props?.data?.filter_list_id)

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST &&
            searchContext?.searchEntity === 'listingsFilterListItem'
        ) {
            listingsManager.runSearch('listingsFilterListItem');
        }
    }, [searchContext?.searchOperation]);

    console.log('ListingsFilterListItem', props?.data)
    return (
        <div className="single_field">
            <label className="widget-title">{props.data.label}</label>
            <ul className="">
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
        </div>
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
