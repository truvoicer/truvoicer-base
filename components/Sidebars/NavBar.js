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
            const fetchSidebar = await fetchSidebarRequest("nav-bar");
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

    function defaultView() {
        return (
            <>
                <div className="container-fluid">
                    <div className="nav-bar">
                        <div className="row align-items-center">
                            <div className="col-lg-1">
                                <div className="logo">
                                    {/*<Link href="/">*/}
                                    {/*    {props.siteData.blogname}*/}
                                    {/*</Link>*/}
                                </div>
                            </div>
                            {Array.isArray(data) && data.length > 0 &&
                                <>
                                    {data.map((item, index) => (
                                        <React.Fragment key={index}>
                                            {item.search &&
                                                <div>
                                                    <Search data={item.search}/>
                                                </div>
                                            }
                                            {item.custom_html && item.custom_html.content &&
                                                <div>
                                                    {parse(item.custom_html.content)}
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
        category: 'sidebars',
        templateId: 'navBar',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            data: data,
            setData: setData,
            ...props
        }
    })
}

function mapStateToProps(state) {
    return {
        siteData: state.page.siteSettings
    };
}

export default connect(
    mapStateToProps,
    null
)(NavBar);
