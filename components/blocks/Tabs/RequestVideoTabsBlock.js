import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import YoutubePlayer from "@/truvoicer-base/components/widgets/Video/YoutubePlayer";
import {isSet} from "@/truvoicer-base/library/utils";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import {ListingsContext} from "@/truvoicer-base/library/listings/contexts/ListingsContext";
import {SearchContext} from "@/truvoicer-base/library/listings/contexts/SearchContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const RequestVideoTabsBlock = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const requestConfig = props.data.request_tabs.request_options;
    const [data, setData] = useState([]);

    const listingsContext = useContext(ListingsContext);
    const searchContext = useContext(SearchContext);
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

    function fetchProviderVideoRequest() {
        listingsContext?.listingsData?.providers.map(async provider => {
            const response = await fetchData(
                "operation",
                [requestConfig.request_name],
                {
                    query: getGameRequestIds(searchContext?.searchList, provider.name),
                    provider: provider.name,
                    limit: requestConfig.request_limit,
                    query_type: "array"
                },
            )
            getDataCallback(response.status, response.data);
        })
    }

    useEffect(() => {
        if (!Array.isArray(searchContext?.searchList) || searchContext?.searchList.length === 0) {
            return;
        }
        if (!Array.isArray(listingsContext?.listingsData?.providers) || listingsContext?.listingsData?.providers.length === 0) {
            return;
        }
        getGameVideoData(searchContext?.searchList)
        fetchProviderVideoRequest();
    }, [props.data.request_tabs, searchContext?.searchList, listingsContext?.listingsData?.providers])

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
        );
}

function mapStateToProps(state) {
    return {
        tabsData: state.page.blocksData?.tru_fetcher_tabs
    };
}

RequestVideoTabsBlock.category = 'public';
RequestVideoTabsBlock.templateId = 'requestVideoTabsBlock';
export default connect(
    mapStateToProps
)(RequestVideoTabsBlock);
