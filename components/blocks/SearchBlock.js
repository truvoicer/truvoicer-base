import React, {useContext, useState} from 'react';
import {NEW_SEARCH_REQUEST} from "../../redux/constants/search-constants";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {ListingsContext} from "@/truvoicer-base/components/blocks/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/components/blocks/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

const SearchBlock = (props) => {
    const categories = props.data?.search?.search_options?.categories.data;
    const featured_categories = props.data?.search?.search_options?.featured_categories.data;
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [category, setCategory] = useState("")
    const [searchData, setSearchData] = useState({})

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    const categoriesClickHandler = (value, e) => {
        e.preventDefault();
        let getSearchData = {...searchData};
        getSearchData[fetcherApiConfig.queryKey] = value.replace("_", " ");
        setSearchData(getSearchData)
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addQueryDataObjectMiddleware(getSearchData, true);
        listingsManager.runSearch();
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
    }

    const formChangeHandler = (e) => {
        e.preventDefault();
        let getSearchData = {...searchData};
        switch (e.target.name) {
            case "query":
                setQuery(e.target.value)
                getSearchData[fetcherApiConfig.queryKey] = e.target.value;
                break;
            case "category":
                setCategory(e.target.value)
                getSearchData.category = e.target.value;
                break;
            case "location":
                setLocation(e.target.value)
                getSearchData.location = e.target.value;
                break;
            default:
                return false;
        }
        setSearchData(getSearchData)
    }

    const formSubmitHandler = (e) => {
        e.preventDefault();
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(NEW_SEARCH_REQUEST);
        listingsManager.getListingsEngine().addQueryDataObjectMiddleware(searchData, true);
        listingsManager.runSearch();
        listingsManager.getListingsEngine().setListingsScrollTopAction(true);
    }
    return (
        <div className="catagory_area">
            <form onSubmit={formSubmitHandler}>
                <div className="container">
                    <div className="row cat_search">
                        <div className="col-lg-3 col-md-4">
                            <div className="single_input">
                                <input type="text"
                                    className="form-control rounded"
                                       placeholder={props.data?.search?.search_options?.search_placeholder}
                                       name={"query"}
                                       value={query}
                                       onChange={formChangeHandler}/>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                            <div className="single_input">
                                <input type="text"
                                    className="form-control rounded"
                                       placeholder={props.data?.search?.search_options?.location_placeholder}
                                       name={"location"}
                                       value={location}
                                       onChange={formChangeHandler}/>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-4">
                            <div className="single_input">
                                <select
                                        className="wide form-control rounded nice-select"
                                        name="category"
                                        defaultValue={category}
                                        onChange={formChangeHandler}>
                                    <option
                                        value="all">{props.data?.search?.search_options?.categories_placeholder}</option>
                                    {categories && categories.map((item, index) => (
                                        <option key={index} value={item.name}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <div className="job_btn">
                                <button type={"submit"}
                                   className="boxed-btn3">{props.data?.search?.search_options?.search_button_label}</button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="popular_search d-flex align-items-center">
                                <span>{props.data?.search?.search_options?.featured_categories_label}</span>
                                <ul>
                                    {featured_categories && featured_categories.map((item, index) => (
                                        <li key={index} value={item.name}>
                                            <a onClick={categoriesClickHandler.bind(this, item.name)}>{item.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default connect(
    null,
    null
)(SearchBlock);
