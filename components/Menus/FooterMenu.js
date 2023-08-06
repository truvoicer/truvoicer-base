import MenuList from "./MenuList";
import React from 'react';

const FooterMenu = (props) => {
    return (
        <div className="col-xl-2 col-md-6 col-lg-2">
            <div className="footer_widget wow fadeInUp" data-wow-duration="1.1s" data-wow-delay=".4s">
                <h3 className="footer_title">
                    {props.data.title}
                </h3>

                <MenuList data={props.data}/>

            </div>
        </div>
    )
}
export default FooterMenu;