import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import {fetchData} from "../../../../truvoicer-base/library/api/fetcher/middleware";
import {uCaseFirst} from "../../../../truvoicer-base/library/utils";
import RequestItemCarousel from "../Carousel/RequestItemCarousel";

const RequestCarouselTabsBlock = (props) => {
    const requestConfig = props.data.request_tabs.request_options;
    const [data, setData] = useState([]);

    const getDataCallback = (status, requestData) => {
        if (status === 200) {
            setData(data => {
                let dataState = [...data];
                dataState.push(requestData)
                return dataState;
            })
        }
    }

    useEffect(() => {
        if (Array.isArray(props.providers) && props.providers.length > 0) {
            props.providers.map(provider => {
                fetchData(
                    "operation",
                    [requestConfig.request_name],
                    {
                        provider: provider.provider_name,
                        limit: requestConfig.request_limit
                    },
                    getDataCallback
                )
            })
        }
    }, [props.data.request_tabs, props.providers])

    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey={0}>
                <section className="monthly-picks-area section-padding-100 bg-pattern">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="left-right-pattern"/>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="section-title mb-70 wow fadeInUp" data-wow-delay="100ms">
                                    {props.data.tabs_block_heading}
                                </h2>
                                <p>{props.data.tabs_block_sub_heading}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                {data.length > 0 &&
                                <Nav variant="tabs" className="wow fadeInUp">
                                    {data.map((tab, index) => (
                                        <Nav.Item key={index}>
                                            <Nav.Link eventKey={index}>{uCaseFirst(tab.provider)}</Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                                }
                            </div>
                        </div>
                    </div>
                    <Tab.Content className={"wow fadeInUp"}>
                        {data.map((tab, index) => (
                            <Tab.Pane eventKey={index} key={index}>
                                <RequestItemCarousel data={tab.request_data} />
                            </Tab.Pane>
                        ))}
                    </Tab.Content>
                </section>
            </Tab.Container>
        </>
    )
}

function mapStateToProps(state) {
    return {
        providers: state.listings.listingsData.providers,
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

export default connect(
    mapStateToProps
)(RequestCarouselTabsBlock);
