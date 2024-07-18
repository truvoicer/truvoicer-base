import {useContext, useEffect} from 'react';
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {isNotEmpty, isObject, isObjectEmpty, scrollToRef} from "@/truvoicer-base/library/utils";
import {AppContext} from "@/truvoicer-base/config/contexts/AppContext";
import {AppManager} from "@/truvoicer-base/library/app/AppManager";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import {connect} from "react-redux";
import {APP_STATE} from "@/truvoicer-base/redux/constants/app-constants";


const ListingsBlockContainer = ({children}) => {

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const appContext = useContext(AppContext);
    const appManager = new AppManager(appContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);

    useEffect(() => {
        if (!isObject(listingsContext?.listingsData) || isObjectEmpty(listingsContext?.listingsData)) {
            return;
        }
        const listingBlockId = listingsManager.getListingBlockId();
        if (!isNotEmpty(listingBlockId)) {
            return;
        }
        appManager.updateAppContexts({
            key: listingBlockId,
            value: {
                listingsContext: listingsContext,
                searchContext: searchContext,
            }
        })
    }, [listingsContext, searchContext])

    return children;
};
ListingsBlockContainer.category = 'listings';
ListingsBlockContainer.templateId = 'listingsBlockContainer';

function mapStateToProps(state) {
    return {
        session: state.session,
        app: state[APP_STATE]
    };
}

export default connect(
    mapStateToProps,
    null
)(ListingsBlockContainer);
