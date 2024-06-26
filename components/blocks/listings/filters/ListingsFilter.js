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
import WidgetContainer from "@/truvoicer-base/components/Sidebars/partials/WidgetContainer";

const ListingsFilter = (props) => {
    const {listingsContextGroup} = props;


    const listingsContext = listingsContextGroup?.listingsContext;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const controlPrefix = "filter_control_";
    const getDataList = (item) => {
        if (item.type === "list" && item.source === "wordpress") {
            return templateManager.render(
                <ListingsFilterListItem
                    listingsContextGroup={listingsContextGroup}
                    controlPrefix={controlPrefix}
                    data={item}
                />
            );
        } else if (item.type === "list" &&  ["api", 'providers'].includes(item.source)) {
            if (isSet(listingsContext?.listingsData.listings_category)) {
                return templateManager.render(
                    <ListingsFilterApiListItem
                        listingsContextGroup={listingsContextGroup}
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
                <WidgetContainer key={index} title={item?.label || ''}>
                    {item.type === "text" &&
                        templateManager.render(
                            <ListingsFilterTextItem
                                listingsContextGroup={listingsContextGroup}
                                controlPrefix={controlPrefix}
                                data={item}
                            />
                        )
                    }
                    {item.type === "date" &&
                        templateManager.render(
                            <ListingsFilterDateItem
                                listingsContextGroup={listingsContextGroup}
                                controlPrefix={controlPrefix}
                                data={item}
                            />
                        )
                    }
                    {item.type === "list" &&
                        getDataList(item)
                    }
                </WidgetContainer>
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
