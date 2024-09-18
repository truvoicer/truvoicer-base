import MenuList from "./MenuList";
import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {Navbar, Container} from "react-bootstrap";

const HeaderMenu = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));


    return (
        <Navbar expand="lg" className="col">
            <div className="site-nav-inner float-left">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                            <span className="navbar-toggler-icon"></span>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/*<div id="navbarSupportedContent"*/}
                        {/*     className="collapse navbar-collapse navbar-responsive-collapse">*/}

                        {templateManager.render(<MenuList data={props.data} sessionLinks={true}/>)}
                        {/*</div>*/}
                    </Navbar.Collapse>
                </Container>
            </div>
        </Navbar>
    )
}
HeaderMenu.category = 'menus';
HeaderMenu.templateId = 'headerMenu';
export default HeaderMenu;
