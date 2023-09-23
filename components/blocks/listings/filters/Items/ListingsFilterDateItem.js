import React, {useContext, useState} from "react";
import DatePicker from "react-datepicker";
import {connect} from "react-redux";
import {NEW_SEARCH_REQUEST} from "@/truvoicer-base/redux/constants/search-constants";

import moment from 'moment';
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const ListingsFilterDateItem = (props) => {
    const dateFormatString = "YYYYMMDD";
    const [startDate, setStartDate] = useState(new Date())

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addListingsQueryDataString("start_date", moment(date).format(dateFormatString), true)
        listingsManager.runSearch();
    };

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

export default connect(
    null,
null
)(ListingsFilterDateItem);
