import React, {useContext, useEffect, useState} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import ListingsItemsContext from "@/truvoicer-base/components/blocks/listings/contexts/ListingsItemsContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";

function HorizontalComparisons(props) {

    const templateManager = new TemplateManager(useContext(TemplateContext));
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const itemsContext = useContext(ListingsItemsContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const [selectedItems, setSelectedItems] = useState([]);

    function getItems() {
        return itemsContext?.items || [];
    }

    function handleItemClick(item, index, e) {
        e.preventDefault();
        setSelectedItems(prevState => {
            let items = [...prevState];
            if (items.includes(index)) {
                items = items.filter(i => i !== index);
            } else {
                items.push(index);
            }
            return items;
        })
    }
    function isItemSelected(index) {
        return selectedItems.includes(index);
    }
    function getLabels() {
        return Object.keys(itemsContext?.labels || {}).map(key => itemsContext.labels[key]);
    }
    function getItemValue(item) {
        return Object.keys(itemsContext?.labels || {}).map(key => item[key]);
    }

    function getFieldValue(field) {
        return data?.override?.[field] || data?.[field] || null
    }
    const labels = getLabels();

    return (
        <section className="cd-products-comparison-table">
            <header>
                <h2>Compare Models</h2>

                <div className="actions">
                    <a href="#0" className="reset">Reset</a>
                    <a href="#0" className="filter">Filter</a>
                </div>
            </header>

            <div className="cd-products-table">
                <div className="features">
                    <div className="top-info">Models</div>
                    <ul className="cd-features-list">
                        {labels.map((label, index) => {
                            return (
                                <li key={index}>{label}</li>
                            );
                        })}
                    </ul>
                </div>

                <div className="cd-products-wrapper">
                    <ul className="cd-products-columns">
                        {getItems().map((item, index) => {
                            return (
                                <li key={index} className={`product ${isItemSelected(index) ? 'selected' : ''}`}>
                                    <div className="top-info" onClick={(e) => handleItemClick(item, index, e)}>
                                        <div className={`check`}></div>
                                        {item?.item_image && <img src={item.item_image} alt="product image"/>}
                                        <h3>Sumsung Series 6 J6300</h3>
                                    </div>

                                    <ul className="cd-features-list">
                                        {getItemValue(item).map((value, index) => {
                                            return (
                                                <li key={index}>{value}</li>
                                            );
                                        })}
                                        {/*<li>$600</li>*/}
                                        {/*<li className="rate"><span>5/5</span></li>*/}
                                        {/*<li>1080p</li>*/}
                                        {/*<li>LED</li>*/}
                                        {/*<li>47.6 inches</li>*/}
                                        {/*<li>800Hz</li>*/}
                                        {/*<li>2015</li>*/}
                                        {/*<li>mpeg4</li>*/}
                                        {/*<li>1 Side</li>*/}
                                        {/*<li>3 Port</li>*/}
                                        {/*<li>1 Rear</li>*/}
                                    </ul>
                                </li>
                            );
                        })}

                    </ul>
                </div>

                <ul className="cd-table-navigation">
                    <li><a href="#0" className="prev inactive">Prev</a></li>
                    <li><a href="#0" className="next">Next</a></li>
                </ul>
            </div>
        </section>
    );
}

export default HorizontalComparisons;
