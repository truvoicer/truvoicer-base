import React, {useContext, useEffect, useRef, useState} from "react";
import NavBar from "@/truvoicer-base/components/Sidebars/NavBar";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {connect} from "react-redux";
import TopSidebar from "@/views/sidebars/TopSidebar";

const Header = ({siteSettings}) => {
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
                <div className="container">
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
            {templateManager.render(<NavBar/>)}
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
