import React, {useContext, useEffect, useState} from "react";
import {connect} from "react-redux";
import Search from "../widgets/Search";
import {siteConfig} from "@/config/site-config";
import parse from 'html-react-parser';
import ButtonWidget from "../widgets/ButtonWidget";
import AccountAreaMenu from "@/truvoicer-base/components/Menus/AccountAreaMenu";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {fetchSidebarRequest} from "@/truvoicer-base/library/api/wordpress/middleware";

const AccountAreaSidebar = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const [data, setData] = useState([]);

    async function sidebarRequest() {
        try {
            const fetchSidebar = await fetchSidebarRequest(siteConfig.accountAreaSidebarName);
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

        return (
            <>
                <div id="sidebar-container" className="sidebar-expanded d-none d-md-block">
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
                                    {item.nav_menu && item.nav_menu.menu_slug === siteConfig.myAccountMenu &&
                                        templateManager.render(<AccountAreaMenu data={item.nav_menu} sessionLinks={true}/>)
                                    }
                                    {item.button_widget &&
                                        templateManager.render(<ButtonWidget data={item.button_widget}/>)
                                    }
                                </React.Fragment>

                            ))}
                        </>
                    }
                </div>
            </>
        )
}

function mapStateToProps(state) {
    return {
        siteData: state.page.siteSettings
    };
}
AccountAreaSidebar.category = 'sidebars';
AccountAreaSidebar.templateId = 'accountAreaSidebar';
export default connect(
    mapStateToProps,
    null
)(AccountAreaSidebar);
