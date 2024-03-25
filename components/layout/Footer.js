import {connect} from "react-redux";
import React, {useContext, useEffect, useState} from "react";
import FooterMenu from "@/truvoicer-base/components/Menus/FooterMenu";
import TextWidget from "@/truvoicer-base/components/widgets/TextWidget";
import SocialIconsWidget from "@/truvoicer-base/components/widgets/SocialIconsWidget";
import {siteConfig} from "@/config/site-config";
import CustomHtmlWidget from "@/truvoicer-base/components/widgets/CustomHtmlWidget";
import {SESSION_AUTHENTICATED} from "@/truvoicer-base/redux/constants/session-constants";
import useSWR from "swr";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const Footer = (props) => {
    const {session, fluidContainer = false} = props;
    const [data, setData] = useState([]);
    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.footerName);
            const sidebar = fetchSidebar?.sidebar;
            if (Array.isArray(sidebar)) {
                setData(sidebar);
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    useEffect(() => {
        sidebarRequest();
    }, []);

    const templateManager = new TemplateManager(useContext(TemplateContext));

    function defaultView() {
        return (
            <footer className={`footer ${!session[SESSION_AUTHENTICATED] ? "ml-0" : ""}`}>
                <div className="footer_top">
                    <div className={`${!fluidContainer ? "container" : "container-fluid"}`}>
                        <div className="row">
                            {Array.isArray(data) && data.length > 0 &&
                                <>
                                    {data.map((item, index) => (
                                        <React.Fragment key={index.toString()}>
                                            {item.nav_menu &&
                                                <FooterMenu data={item.nav_menu} sidebar={"footer"}/>
                                            }
                                            {item.text &&
                                                <TextWidget data={item.text}/>
                                            }
                                            {item.custom_html &&
                                                <CustomHtmlWidget data={item.custom_html}/>
                                            }
                                            {item.social_media_widget &&
                                                <SocialIconsWidget data={item.social_media_widget}/>
                                            }
                                        </React.Fragment>
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'layout',
        templateId: 'footer',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            data: data,
            setData: setData,
            ...props
        }
    });
}

function mapStateToProps(state) {
    return {
        footerData: state.page.footer,
        session: state.session
    };
}

export default connect(
    mapStateToProps,
    null
)(Footer);
