import React, {useContext, useState} from "react";
import {SESSION_USER, SESSION_USER_ID} from "@/truvoicer-base/redux/constants/session-constants";
import {connect} from "react-redux";
import parse from 'html-react-parser';
import Link from "next/link";
import {isNotEmpty} from "@/truvoicer-base/library/utils";
import {CSSTransition} from "react-transition-group";
import {faAngleDown, faAngleUp, faClock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {ListingsManager} from "@/truvoicer-base/library/listings/listings-manager";
import ProsConsList from "@/truvoicer-base/components/widgets/ProsConsList";
import StarRatings from "@/truvoicer-base/components/widgets/StarRatings";
import Image from "next/image";

/**
 *
 * @param data
 * @param searchCategory
 * @param index
 * @returns {JSX.Element}
 * @constructor
 */
const ComparisonsItemList = ({data, searchCategory, index}) => {
    const [showExpandedContent, setShowExpandedContent] = useState(false);
    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
    const listingsManager = new ListingsManager(listingsContext, searchContext);
    const linkProps = listingsManager.getListingsEngine().getItemLinkProps({
        category: searchCategory,
        item: data,
    });
    function getFieldValue(field) {
        return data?.override?.[field] || data?.[field] || null
    }
    return (
        <div className="listings-table--row">
            <div className="listings-table--row--index d-none d-md-flex">
                <span>
                {index + 1}
                </span>
            </div>
            {isNotEmpty(getFieldValue('item_ribbon_text')) &&
                <div className="listings-table--row--ribbon">
                    <span className="listings-table--row--ribbon__text">
                        {getFieldValue('item_ribbon_text')}
                    </span>
                </div>
            }
            <div className="listings-table--row--columns">
                <div className={"listings-table--row--columns--brand"}>
                    <div
                        className={"listings-table--row--columns--brand--logo"}
                        style={{
                            backgroundColor: (isNotEmpty(getFieldValue('item_logo_bg'))) ? getFieldValue('item_logo_bg') : "transparent"
                        }}
                    >
                        <a href={getFieldValue('item_url')}>
                            <img  src={getFieldValue('item_logo') ? getFieldValue('item_logo') : "/img/pticon.png"} alt=""/>
                        </a>
                    </div>
                    <div
                        className={"listings-table--row--columns--brand--text d-block d-md-none"}
                    >
                        {getFieldValue('item_offer')? parse(getFieldValue('item_offer')) : ""}
                    </div>
                </div>
                <div className={"listings-table--row--columns--offer d-block d-md-none"}>
                    <div className={"listings-table--row--columns--offer--ratings"}>
                        <div className={"listings-table--row--columns--offer--ratings--stars"}>
                            <StarRatings
                                rating={getFieldValue('item_rating')}
                            />
                        </div>
                    </div>
                </div>
                <div className={"listings-table--row--columns--content"}>
                    <div className={"listings-table--row--columns--content--summary"}>
                        {getFieldValue('item_content')}
                    </div>
                    <div className={"listings-table--row--columns--content--pros d-none d-md-block"}>
                        <ProsConsList
                            list={Array.isArray(getFieldValue('item_pros')) ? getFieldValue('item_pros').map(item => item.value) : null}
                            type={"pros"}
                        />
                    </div>
                </div>
                <div className={"listings-table--row--columns--offer"}>
                    <div className={"listings-table--row--columns--offer--ratings d-none d-md-block"}>
                        {/*<div className={"listings-table--row--offer--ratings--label"}>*/}
                        {/*    Rating:*/}
                        {/*</div>*/}
                        <div className={"listings-table--row--columns--offer--ratings--stars"}>
                            <StarRatings
                                rating={getFieldValue('item_rating')}
                            />
                        </div>
                    </div>
                    <div className={"listings-table--row--columns--offer--cta"}>
                        {isNotEmpty(linkProps?.href) &&
                        <Link {...linkProps}
                            className="boxed-btn3"
                        >
                                Apply Now
                        </Link>
                        }
                    </div>
                    <div
                        className={"listings-table--row--columns--offer--text d-none d-md-block"}
                    >
                        {getFieldValue('item_offer')? parse(getFieldValue('item_offer')) : ""}
                    </div>
                </div>
            </div>
            <div className={"listings-table--row--expander"}>
                <a className={"listings-table--row--expander--trigger"}
                   onClick={(e) => {
                       e.preventDefault()
                       setShowExpandedContent(!showExpandedContent)
                   }}
                >
                    {!showExpandedContent
                        ?
                        <>
                            <span>Show More</span>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </>
                        :
                        <>
                            <span>Show Less</span>
                            <FontAwesomeIcon icon={faAngleUp} />
                        </>
                    }
                </a>
            </div>
            <CSSTransition in={showExpandedContent} timeout={200} classNames="app--css-transition">
                <div className={`listings-table--row--expanded-content`}>
                    <div className={"listings-table--row--description"}>
                        {parse(getFieldValue('item_content') || '')}
                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER],
    };
}

export default connect(
    mapStateToProps,
    null
)(ComparisonsItemList);
