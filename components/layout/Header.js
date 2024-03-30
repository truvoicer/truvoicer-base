import React, {useContext, useEffect, useRef, useState} from "react";
import NavBar from "@/truvoicer-base/components/Sidebars/NavBar";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const Header = (props) => {
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
    console.log('base Header')
    return (
        <>
            <div id="top-bar" className="top-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="ts-date">
                                <i className="fa fa-calendar-check-o"></i>May 29, 2017
                            </div>
                            <ul className="unstyled top-nav">
                                <li><a href="#">About</a></li>
                                <li><a href="#">Write for Us</a></li>
                                <li><a href="#">Advertise</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>

                        <div className="col-md-4 top-social text-lg-right text-md-center">
                            <ul className="unstyled">
                                <li>
                                    <a title="Facebook" href="#">
                                        <span className="social-icon"><i className="fa fa-facebook"></i></span>
                                    </a>
                                    <a title="Twitter" href="#">
                                        <span className="social-icon"><i className="fa fa-twitter"></i></span>
                                    </a>
                                    <a title="Google+" href="#">
                                        <span className="social-icon"><i className="fa fa-google-plus"></i></span>
                                    </a>
                                    <a title="Linkdin" href="#">
                                        <span className="social-icon"><i className="fa fa-linkedin"></i></span>
                                    </a>
                                    <a title="Rss" href="#">
                                        <span className="social-icon"><i className="fa fa-rss"></i></span>
                                    </a>
                                    <a title="Skype" href="#">
                                        <span className="social-icon"><i className="fa fa-skype"></i></span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <header ref={ref} id="header" className="header">
                {/*<div id="sticky-header" className={`main-header-area${isSticky ? ' sticky' : ''}`}>*/}
                {/*    {templateManager.render(<NavBar/>)}*/}
                {/*</div>*/}
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-12">
                            <div className="logo">
                                <a href="#">
                                    <img src="/images/logos/logo.png" alt=""/>
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

export default Header;
