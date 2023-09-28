import HeaderMenu from "@/truvoicer-base/components/Menus/HeaderMenu";
import {connect} from "react-redux";
import Search from "../widgets/Search";
import React, {useContext} from "react";
import ReactHtmlParser from "react-html-parser";
import {siteConfig} from "@/config/site-config";
import MobileDrawerMenu from "@/truvoicer-base/components/Menus/MobileDrawerMenu";
import ButtonWidget from "../widgets/ButtonWidget";
import ProfileMenu from "@/truvoicer-base/components/Menus/ProfileMenu";
import Error from "next";
import {buildWpApiUrl, fetcher, getSidebar} from "@/truvoicer-base/library/api/wp/middleware";
import {getSidebarMenuItem} from "@/truvoicer-base/library/helpers/pages";
import useSWR from "swr";
import {wpApiConfig} from "@/truvoicer-base/config/wp-api-config";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const NavBar = (props) => {
    const { data: sidebarData, error: sidebarError } = useSWR(buildWpApiUrl(wpApiConfig.endpoints.sidebar, "nav-bar"), fetcher)
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const sidebarLoading = !sidebarError && !sidebarData
    if (sidebarLoading) return <></>
    if (sidebarError) return <Error />

    let sidebarMenu = [];
    if (Array.isArray(sidebarData?.sidebar)) {
        sidebarMenu = sidebarData.sidebar;
    }
    const mobileMenu = getSidebarMenuItem(siteConfig.mobileMenu, sidebarMenu);
    function defaultView() {
    return (
        <>
            <div className="container-fluid">
                <div className="nav-bar">
                    <div className="row align-items-center">
                        <div className="col-lg-1">
                            <div className="logo">
                                <a href="/">
                                    {props.siteData.blogname}
                                </a>
                            </div>
                        </div>
                        {Array.isArray(sidebarMenu) && sidebarMenu.length > 0 &&
                        <>
                            {sidebarMenu.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.search &&
                                    <div>
                                        <Search data={item.search}/>
                                    </div>
                                    }
                                    {item.custom_html && item.custom_html.content &&
                                    <div>
                                        {ReactHtmlParser(item.custom_html.content)}
                                    </div>
                                    }
                                    {item.nav_menu && item.nav_menu.menu_slug === siteConfig.navMenu &&
                                    <div className="col-lg-6 col-xl-7">
                                        <HeaderMenu data={item.nav_menu}/>
                                    </div>

                                    }
                                    {item.button_widget &&
                                    <div className="col-lg-2 col-xl-2 d-none d-lg-block text-right">
                                        <ButtonWidget data={item.button_widget}/>
                                    </div>
                                    }
                                    {item.saved_items_widget &&
                                        <></>
                                    // <p>Saved Items</p>
                                        // <UserSavedItemsBlock data={item.button_widget} />
                                    }
                                    {item.nav_menu && item.nav_menu.menu_slug === siteConfig.profileMenu &&
                                    <div className="col-lg-2 col-xl-2 d-none d-lg-block text-right">
                                        <ProfileMenu data={item.nav_menu}/>
                                    </div>
                                    }
                                </React.Fragment>

                            ))}
                        </>
                        }
                    </div>
                    {mobileMenu &&
                    <MobileDrawerMenu data={mobileMenu.nav_menu}/>
                    }
                </div>
            </div>
        </>
    )
    }
    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'heroBlock',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            buttonClickHandler: buttonClickHandler
        }
    })
}

function mapStateToProps(state) {
    return {
        siteData: state.page.siteSettings
    };
}

export default
connect(
    mapStateToProps,
    null
)(NavBar);
