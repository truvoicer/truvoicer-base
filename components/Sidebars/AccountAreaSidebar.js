import React, {useContext, useState} from "react";
import {connect} from "react-redux";
import Search from "../widgets/Search";
import {siteConfig} from "../../../config/site-config";
import ReactHtmlParser from "react-html-parser";
import ButtonWidget from "../widgets/ButtonWidget";
import AccountAreaMenu from "@/truvoicer-base/components/Menus/AccountAreaMenu";
import {getSidebar} from "../../library/api/wp/middleware";
import LoaderComponent from "../widgets/Loader";
import Error from "next";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const AccountAreaSidebar = (props) => {
    const { sidebarData, isLoading, isError } = getSidebar(siteConfig.accountAreaSidebarName)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    if (isLoading) return <LoaderComponent />
    if (isError) return <Error />

    function defaultView() {
    return (
        <>
            <div id="sidebar-container" className="sidebar-expanded d-none d-md-block">
                {Array.isArray(sidebarData) && sidebarData.length > 0 &&
                <>
                    {sidebarData.map((item, index) => (
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
                            {item.nav_menu && item.nav_menu.menu_slug === siteConfig.myAccountMenu &&
                            <AccountAreaMenu data={item.nav_menu} sessionLinks={true}/>
                            }
                            {item.button_widget &&
                            <ButtonWidget data={item.button_widget}/>
                            }
                        </React.Fragment>

                    ))}
                </>
                }
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

export default connect(
    mapStateToProps,
    null
)(AccountAreaSidebar);
