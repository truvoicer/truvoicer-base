import React, {useContext, useEffect, useState} from 'react';
import {SEARCH_REQUEST_NEW, SEARCH_STATUS_STARTED} from "../../redux/constants/search-constants";
import {connect} from "react-redux";
import {fetcherApiConfig} from "../../config/fetcher-api-config";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {buildFilterList} from "@/truvoicer-base/library/helpers/wp-helpers";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Link from "next/link";

const SearchBlock = (props) => {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [category, setCategory] = useState("")
    const [searchData, setSearchData] = useState({})

    const appContext = useContext(AppContext);

    const appManager = new AppManager(appContext);
    const listingsContext = appManager.findAppContextById(props?.data?.listing_block_id, "listingsContext");
    const searchContext = appManager.findAppContextById(props?.data?.listing_block_id, "searchContext");

    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    let showSearch = (props.data?.search);
    let categoriesPlaceholder = 'Categories';
    let featuredCategoriesLabel = 'Featured Categories';
    let locationPlaceholder = 'Location';
    let searchButtonLabel = 'Search';
    let searchPlaceholder = 'Search';

    const categories = buildFilterList(props?.data?.filter_list_id__search__categories);
    const featured_categories = buildFilterList(props?.data?.filter_list_id__search__featured_categories);

    if (isNotEmpty(props.data?.search__categories_placeholder)) {
        categoriesPlaceholder = props.data.search__categories_placeholder;
    }
    if (isNotEmpty(props.data?.search__featured_categories_label)) {
        featuredCategoriesLabel = props.data.search__featured_categories_label;
    }
    if (isNotEmpty(props.data?.search__location_placeholder)) {
        locationPlaceholder = props.data.search__location_placeholder;
    }
    if (isNotEmpty(props.data?.search__search_button_label)) {
        searchButtonLabel = props.data.search__search_button_label;
    }
    if (isNotEmpty(props.data?.search__search_placeholder)) {
        searchPlaceholder = props.data.search__search_placeholder;
    }

    const categoriesClickHandler = (value, e) => {
        e.preventDefault();
        let getSearchData = {...searchData};
        getSearchData[fetcherApiConfig.queryKey] = value.replace("_", " ");
        setSearchData(getSearchData)
        listingsManager.getSearchEngine().setSearchEntity('searchBlockCategory');
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        listingsManager.getSearchEngine().addQueryDataObjectMiddleware(getSearchData, true);
    }


    useEffect(() => {
        switch (searchContext?.searchEntity) {
            case 'searchBlockCategory':
                if (
                    isNotEmpty(category) &&
                    listingsManager.canRunSearch(SEARCH_REQUEST_NEW) &&
                    searchContext?.searchEntity === 'searchBlockCategory'
                ) {

                    listingsManager.getListingsEngine().setListingsScrollTopAction(true);
                }
                break;
            case 'searchBlock':
                if (
                    listingsManager.canRunSearch(SEARCH_REQUEST_NEW) &&
                    searchContext?.searchEntity === 'searchBlock'
                ) {

                    listingsManager.getListingsEngine().setListingsScrollTopAction(true);
                }
                break;
        }
    }, [searchContext?.searchOperation, category]);

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
        listingsManager.getSearchEngine().setSearchRequestOperationMiddleware(SEARCH_REQUEST_NEW);
        listingsManager.getSearchEngine().addQueryDataObjectMiddleware(searchData, true);
        listingsManager.getSearchEngine().setSearchEntity('searchBlock');
    }

    return (
        <>
            {showSearch &&
                <div className="catagory_area">
                    <form onSubmit={formSubmitHandler}>
                        <div className="container">
                            <div className="row cat_search">
                                <div className="col-lg-3 col-md-4">
                                    <div className="single_input">
                                        <input type="text"
                                               className="form-control rounded"
                                               placeholder={searchPlaceholder}
                                               name={"query"}
                                               value={query}
                                               onChange={formChangeHandler}/>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <div className="single_input">
                                        <input type="text"
                                               className="form-control rounded"
                                               placeholder={locationPlaceholder}
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
                                                value="all">{categoriesPlaceholder}</option>
                                            {categories && categories.map((item, index) => (
                                                <option key={index} value={item.name}>{item.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className="job_btn">
                                        <button type={"submit"}
                                                className="boxed-btn3">{searchButtonLabel}</button>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="popular_search d-flex align-items-center">
                                        <span>{featuredCategoriesLabel}</span>
                                        <ul className={'list-unstyled'}>
                                            {featured_categories && featured_categories.map((item, index) => (
                                                <li className={'d-inline-block'} key={index} value={item.name}>
                                                    <Link href={'#'} onClick={categoriesClickHandler.bind(this, item.name)}>{item.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    );
}

SearchBlock.category = 'public';
SearchBlock.templateId = 'searchBlock';
export default connect(
    null,
    null
)(SearchBlock);
