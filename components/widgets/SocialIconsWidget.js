import React from 'react';

const SocialIconsWidget = (props) => {
    return (
        <>
            <div className="single-footer-widget mb-70">
                <div className="widget-title">
                    <h4>{props.data.title}</h4>
                </div>
                <div className="widget-content">
                    {props.data.facebook &&
                    <a href={props.data.facebook} className="pl-0 pr-3"><span className="icon-facebook"/></a>
                    }
                    {props.data.twitter &&
                    <a href={props.data.twitter} className="pl-0 pr-3"><span className="icon-twitter"/></a>
                    }
                    {props.data.instagram &&
                    <a href={props.data.instagram} className="pl-0 pr-3"><span className="icon-instagram"/></a>
                    }
                    {props.data.linkedin &&
                    <a href={props.data.linkedin} className="pl-0 pr-3"><span className="icon-linkedin"/></a>
                    }
                </div>
            </div>

        </>
    );
}
export default SocialIconsWidget;
