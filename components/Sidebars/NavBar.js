import HeaderMenu from "@/truvoicer-base/components/Menus/HeaderMenu";
import {connect} from "react-redux";
import Search from "../widgets/Search";
import React, {useContext, useEffect} from "react";
import parse from 'html-react-parser';
import {siteConfig} from "@/config/site-config";
import MobileDrawerMenu from "@/truvoicer-base/components/Menus/MobileDrawerMenu";
import ButtonWidget from "../widgets/ButtonWidget";
import ProfileMenu from "@/truvoicer-base/components/Menus/ProfileMenu";
import {getSidebarMenuItem} from "@/truvoicer-base/library/helpers/pages";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const NavBar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = React.useState([]);

    const mobileMenu = getSidebarMenuItem(siteConfig.mobileMenu, data);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetch(`/api/wp/sidebar/nav-bar`);
            const sidebar = await fetchSidebar.json();
            if (Array.isArray(sidebar?.data?.sidebar)) {
                setData(sidebar?.data?.sidebar);
            }
        } catch (e) {
            console.warn(e.message);
        }
    }

    useEffect(() => {
        console.log(templateManager.hasTemplateComponent('sidebars', 'navBar'))
        if (templateManager.hasTemplateComponent('sidebars', 'navBar')) {
            return;
        }
        sidebarRequest();
    }, []);

    return (
        <div className="main-nav clearfix">
            <div className="container">
                    <div className="row">
                        {Array.isArray(data) && data.length > 0 &&
                            <>
                                {data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.search &&
                                            <div>
                                                {templateManager.render(<Search data={item.search}/>)}
                                            </div>
                                        }
                                        {item.custom_html && item.custom_html.content &&
                                            <div>
                                                {parse(item.custom_html.content)}
                                            </div>
                                        }
                                        {item.nav_menu && item.nav_menu.menu_slug === siteConfig.navMenu &&
                                            <div className="col-lg-6 col-xl-7">
                                                {templateManager.render(<HeaderMenu data={item.nav_menu}/>)}
                                            </div>

                                        }
                                        {item.button_widget &&
                                            <div className="col-lg-2 col-xl-2 d-none d-lg-block text-right">
                                                {templateManager.render(<ButtonWidget data={item.button_widget}/>)}
                                            </div>
                                        }
                                        {item.saved_items_widget &&
                                            <></>
                                            // <p>Saved Items</p>
                                            // <UserSavedItemsBlock data={item.button_widget} />
                                        }
                                        {item.nav_menu && item.nav_menu.menu_slug === siteConfig.profileMenu &&
                                            <div className="col-lg-2 col-xl-2 d-none d-lg-block text-right">
                                                {templateManager.render(<ProfileMenu data={item.nav_menu}/>)}
                                            </div>
                                        }
                                    </React.Fragment>

                                ))}
                            </>
                        }
                    </div>
                    {mobileMenu &&
                        templateManager.render(<MobileDrawerMenu data={mobileMenu.nav_menu}/>)
                    }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        siteData: state.page.siteSettings
    };
}
NavBar.category = 'sidebars';
NavBar.templateId = 'navBar';
export default connect(
    mapStateToProps,
    null
)(NavBar);
