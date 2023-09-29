import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const SocialIconsWidget = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    function defaultView() {
        return (
            <div className="col-xl-3 col-md-6 col-lg-3">
                <div className="footer_widget wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                    <h3 className="footer_title">
                        <h4>{props.data.title}</h4>
                    </h3>
                    <div className="socail_links">
                        <ul>
                            {props.data.facebook &&
                                <li><a href={props.data.facebook} className="pl-0 pr-3"><span
                                    className="icon-facebook"/></a>
                                </li>
                            }
                            {props.data.twitter &&
                                <li><a href={props.data.twitter} className="pl-0 pr-3"><span className="icon-twitter"/></a>
                                </li>
                            }
                            {props.data.instagram &&
                                <li><a href={props.data.instagram} className="pl-0 pr-3"><span
                                    className="icon-instagram"/></a>
                                </li>
                            }
                            {props.data.linkedin &&
                                <li><a href={props.data.linkedin} className="pl-0 pr-3"><span
                                    className="icon-linkedin"/></a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'widgets',
        templateId: 'socialIconsWidget',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            ...props
        }
    })
}
export default SocialIconsWidget;
