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
    function defaultView() {
        return (
            <>
                <header ref={ref}>
                    <div className="header-area" id={"header"}>
                        <div id="sticky-header" className={`main-header-area${isSticky ? ' sticky' : ''}`}>
                            <NavBar/>
                        </div>
                    </div>
                </header>
            </>
        )
    }
    return templateManager.getTemplateComponent({
        category: 'layout',
        templateId: 'header',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            isSticky,
            setSticky,
            handleScroll,
            ...props
        }
    });
}

export default Header;
