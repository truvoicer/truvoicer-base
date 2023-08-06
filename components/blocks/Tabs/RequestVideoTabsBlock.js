import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import YoutubePlayer from "../../../../truvoicer-base/components/widgets/Video/YoutubePlayer";
import {isSet} from "../../../../truvoicer-base/library/utils";
import {fetchData} from "../../../../truvoicer-base/library/api/fetcher/middleware";

const RequestVideoTabsBlock = (props) => {
    const requestConfig = props.data.request_tabs.request_options;
    const [data, setData] = useState([]);
    const getDataCallback = (status, requestData) => {
        if (status === 200) {
            requestData.map(item => {
                if (item.status === "success" && Array.isArray(item.request_data) && item.request_data.length > 0) {
                    mergeVideoData(item.request_data)
                }
            })
        }
    }

    const mergeVideoData = (videoDataArray) => {
        setData(data => {
            // dataState.push(requestData)
            return [...data, ...videoDataArray];
        })
    }

    useEffect(() => {
        if (!Array.isArray(props.searchList) || props.searchList.length === 0) {
            return;
        }
        if (!Array.isArray(props.providers) || props.providers.length === 0) {
            return;
        }
        getGameVideoData(props.searchList)
        props.providers.map(provider => {
            fetchData(
                "operation",
                [requestConfig.request_name],
                {
                    query: getGameRequestIds(props.searchList, provider.provider_name),
                    provider: provider.provider_name,
                    limit: requestConfig.request_limit,
                    query_type: "array"
                },
                getDataCallback
            )
        })

    }, [props.data.request_tabs, props.searchList, props.providers])

    const getVideo = (tab) => {
        return <YoutubePlayer video_id={tab.video_id} video_name={tab.video_name} />
    }

    const getGameRequestIds = (gameList, provider) => {
        let list = [];
        gameList.map((item) => {
            if (
                item.provider === provider &&
                isSet(item.item_videos) &&
                item.item_videos !== null &&
                isSet(item.item_videos.request_item)
            ) {
                list.push(item.item_id);
            }
        });
        return list.join(",");
    }

    const getGameVideoData = (gameList) => {
        gameList.map((item) => {
            if (
                isSet(item.item_videos) &&
                Array.isArray(item.item_videos) &&
                item.item_videos.length > 0
            ) {
                mergeVideoData(item.item_videos)
            }
        });
    }

    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey={0}>
                <div className="egames-video-area section-padding-100 bg-pattern2">
                    <div className="container">
                        <h2 className="section-title mb-40 wow fadeInUp" data-wow-delay="100ms">
                            {props.data.tabs_block_heading}
                        </h2>
                        <p>{props.data.tabs_block_sub_heading}</p>
                        <div className="row no-gutters">
                            <div className="col-12 col-md-6 col-lg-4  order-last order-md-first">
                                {data.length > 0 &&
                                <div className="egames-nav-btn">
                                    <Nav variant="pills" className="nav flex-column">
                                        {data.map((tab, index) => (
                                            <Nav.Item key={index}>
                                                <Nav.Link eventKey={index}>
                                                    <div className="single-video-widget d-flex wow fadeInUp"
                                                         data-wow-delay="100ms">
                                                        <div className="video-text">
                                                            <p className="video-title mb-0">
                                                                {tab.video_name}
                                                            </p>
                                                            <span>{tab.provider}</span>
                                                        </div>
                                                        {/*<div className="video-rating">8.3/10</div>*/}
                                                    </div>
                                                </Nav.Link>
                                            </Nav.Item>
                                        ))}
                                    </Nav>
                                </div>
                                }
                            </div>

                            <div className="col-12 col-md-6 col-lg-8 order-first order-md-last">
                                <Tab.Content>
                                    {data.map((tab, index) => (
                                        <Tab.Pane eventKey={index} key={index}>
                                            <div className="video-playground bg-img">
                                                {getVideo(tab)}
                                            </div>
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </div>
                        </div>
                    </div>
                </div>
            </Tab.Container>
        </>
    )
}

function mapStateToProps(state) {
    return {
        searchList: state.search.searchList,
        providers: state.listings.listingsData.providers,
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

export default connect(
    mapStateToProps
)(RequestVideoTabsBlock);
