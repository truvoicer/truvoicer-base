import React, {useContext, useEffect, useRef, useState} from "react";
import HorizontalSidebar from "@/truvoicer-base/components/Sidebars/HorizontalSidebar";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {connect} from "react-redux";

const Header = ({
    siteSettings,
    showSidebar = false,
    sidebarName
}) => {
    const [isSticky, setSticky] = useState(false);
    const ref = useRef(null);

    const templateManager = new TemplateManager(useContext(TemplateContext));
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, [])

    const handleScroll = (e) => {
        if (ref.current) {
            setSticky(ref.current.getBoundingClientRect().top <= -50);
        }
    }

    return (
        <>
            {/*<TopSidebar />*/}
            <header ref={ref} id="header" className="header">
                <div className="container section-block">
                    <div className="row justify-content-center">
                        <div className="col-md-3 col-sm-12">
                            <div className="logo">
                                <a href="#">
                                    {siteSettings?.logo
                                        ? <img src={siteSettings.logo} alt=""/>
                                        : siteSettings?.blogname || ''
                                    }
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
            {showSidebar && templateManager.render(<HorizontalSidebar sidebarName={sidebarName}/>)}
        </>
    )
}
Header.category = 'layout';
Header.templateId = 'header';

export default connect(
    (state) => ({
        siteSettings: state.page.siteSettings,
        pageData: state.page.pageData,
    }),
    null
)(Header);
