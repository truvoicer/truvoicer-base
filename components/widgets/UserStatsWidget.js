import React from 'react';

function UserStatsWidget({data}) {
    return (
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
                        <i className="fas fa-shopping-cart"/>
                    </div>
                    <a href="#" className="small-box-footer">
                        More info <i className="fas fa-arrow-circle-right"/>
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
                        More info <i className="fas fa-arrow-circle-right"/>
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
                        <i className="fas fa-user-plus"/>
                    </div>
                    <a href="#" className="small-box-footer">
                        More info <i className="fas fa-arrow-circle-right"/>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default UserStatsWidget;