import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleRight, faSearch, faShoppingCart, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import WpDataLoader from "@/truvoicer-base/components/loaders/WpDataLoader";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";
import ComponentLoader from "@/truvoicer-base/components/loaders/ComponentLoader";

function UserStatsWidget(props) {
    const {data, parentAccessControl} = props;

    return (
        <ComponentLoader
            selfAccessControl={data?.access_control}
            parentAccessControl={parentAccessControl}>
            <div className="featured-tab color-blue">
                <h3 className="block-title"><span>{data?.heading || 'Stats'}</span></h3>
                <div className="row">
                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <h3>41,410</h3>
                                <div className="progress">
                                    <div className="progress-bar" style={{width: "70%"}}/>
                                </div>
                                <span className="progress-description">
                          70% Increase in 30 Days
                        </span>
                            </div>
                            <div className="icon">
                                <FontAwesomeIcon icon={faShoppingCart}/>
                            </div>
                            <a href="#" className="small-box-footer">
                                More info <FontAwesomeIcon icon={faArrowCircleRight}/>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <h3>53%</h3>
                                <p>Bounce Rate</p>
                            </div>
                            <div className="icon">
                                <i className="ion ion-stats-bars"/>
                            </div>
                            <a href="#" className="small-box-footer">
                                More info <FontAwesomeIcon icon={faArrowCircleRight}/>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-6">
                        <div className="small-box bg-warning">
                            <div className="inner">
                                <h3>44</h3>
                                <p>User Registrations</p>
                            </div>
                            <div className="icon">
                                <FontAwesomeIcon icon={faUserPlus}/>
                            </div>
                            <a href="#" className="small-box-footer">
                                More info <FontAwesomeIcon icon={faArrowCircleRight}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentLoader>
    );

}

UserStatsWidget.category = 'widgets';
UserStatsWidget.templateId = 'userStatsWidget';
export default UserStatsWidget;
