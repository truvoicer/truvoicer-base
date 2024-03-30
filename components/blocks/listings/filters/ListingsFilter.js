import React, {useContext} from "react";
import ListingsFilterDateItem from "./Items/ListingsFilterDateItem";
import ListingsFilterTextItem from "./Items/ListingsFilterTextItem";
import ListingsFilterListItem from "./Items/ListingsFilterListItem";
import ListingsFilterApiListItem from "./Items/ListingsFilterApiListItem";
import {isSet} from "../../../../library/utils";
import {connect} from "react-redux";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ListingsFilter = (props) => {
    const {listingsContextGroup} = props;

    const controlPrefix = "filter_control_";

    const listingsContext = listingsContextGroup?.listingsContext;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getDataList = (item) => {
        if (item.type === "list" && item.source === "wordpress") {
            return templateManager.render(
                <ListingsFilterListItem
                    controlPrefix={controlPrefix}
                    data={item}
                />
            );
        } else if (item.type === "list" && item.source === "api") {
            if (isSet(listingsContext?.listingsData.listings_category)) {
                return templateManager.render(
                    <ListingsFilterApiListItem
                        controlPrefix={controlPrefix}
                        data={item}
                    />
                )
            }
            return <p>Loading...</p>
        }
        return null
    }

    const listingsFilterData = listingsContext?.listingsData?.filters
    if (
        !Array.isArray(listingsFilterData) ||
        listingsFilterData.length === 0
    ) {
        return null;
    }
    return (
        <>
            {listingsFilterData?.filter_heading &&
                <h3>{listingsFilterData.filter_heading}</h3>
            }
            {listingsFilterData.map((item, index) => (
                <React.Fragment key={index}>
                    {item.type === "text" &&
                        templateManager.render(<ListingsFilterTextItem
                        controlPrefix={controlPrefix}
                        data={item}
                    />)
                    }
                    {item.type === "date" &&
                        templateManager.render(<ListingsFilterDateItem
                        controlPrefix={controlPrefix}
                        data={item}
                    />)
                    }
                    {item.type === "list" &&
                    getDataList(item)
                    }
                </React.Fragment>
            ))}
        </>
    )
}

function mapStateToProps(state) {
    return {};
}

ListingsFilter.category = 'listings';
ListingsFilter.templateId = 'listingsFilter';
export default connect(
    mapStateToProps
)(ListingsFilter);
