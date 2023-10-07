import {connect} from "react-redux";
import React, {useContext} from "react";
import FooterMenu from "@/truvoicer-base/components/Menus/FooterMenu";
import TextWidget from "@/truvoicer-base/components/widgets/TextWidget";
import SocialIconsWidget from "@/truvoicer-base/components/widgets/SocialIconsWidget";
import {buildWpApiUrl, fetcher, getSidebar} from "@/truvoicer-base/library/api/wp/middleware";
import {siteConfig} from "@/config/site-config";
import LoaderComponent from "@/truvoicer-base/components/loaders/Loader";
import Error from "next";
import CustomHtmlWidget from "@/truvoicer-base/components/widgets/CustomHtmlWidget";
import {SESSION_AUTHENTICATED} from "@/truvoicer-base/redux/constants/session-constants";
import useSWR from "swr";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const Footer = (props) => {
    const {session, fluidContainer = false} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const { data: sidebarData, error: sidebarError } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, siteConfig.footerName), fetcher)
    const sidebarLoading = !sidebarError && !sidebarData
    if (sidebarLoading) return <></>
    if (sidebarError) return <Error />

    let sidebarMenu = [];
    if (Array.isArray(sidebarData?.sidebar)) {
        sidebarMenu = sidebarData.sidebar;
    }

    function defaultView() {
        return (
            <footer className={`footer ${!session[SESSION_AUTHENTICATED] ? "ml-0" : ""}`}>
                <div className="footer_top">
                    <div className={`${!fluidContainer ? "container" : "container-fluid"}`}>
                        <div className="row">
                            {Array.isArray(sidebarMenu) && sidebarMenu.length > 0 &&
                                <>
                                    {sidebarMenu.map((item, index) => (
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
            sidebarData: sidebarData,
            sidebarError: sidebarError,
            sidebarLoading: sidebarLoading,
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
