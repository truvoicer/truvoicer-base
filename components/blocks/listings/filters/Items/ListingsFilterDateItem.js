import React, {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {connect} from "react-redux";
import {NEW_SEARCH_REQUEST, SEARCH_REQUEST_STARTED} from "@/truvoicer-base/redux/constants/search-constants";

import moment from 'moment';
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilterDateItem = (props) => {
    const dateFormatString = "YYYYMMDD";
    const [startDate, setStartDate] = useState(new Date())

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const handleStartDateChange = (date) => {
        setStartDate(date);
        listingsManager.getSearchEngine().setSearchEntity('listingsFilterDateItem');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString("start_date", moment(date).format(dateFormatString), true)
    };

    useEffect(() => {
        if (
            searchContext?.searchStatus !== SEARCH_REQUEST_STARTED &&
            searchContext?.searchOperation === NEW_SEARCH_REQUEST &&
            searchContext?.searchEntity === 'listingsFilterDateItem'
        ) {
            listingsManager.runSearch('listingsFilterDateItem');
        }
    }, [searchContext?.searchOperation]);
    function defaultView() {
        return (
            <div className="single_field">
                <label>{props.data.label}</label>
                <DatePicker
                    className={"filter-datepicker form-control rounded"}
                    selected={startDate}
                    onChange={handleStartDateChange}
                    startDate={startDate}
                />
            </div>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'listings',
        templateId: 'listingsFilterDateItem',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            startDate: startDate,
            handleStartDateChange: handleStartDateChange,
            setStartDate: setStartDate
        }
    })
}

export default connect(
    null,
    null
)(ListingsFilterDateItem);
