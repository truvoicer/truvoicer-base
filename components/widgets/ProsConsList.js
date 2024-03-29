import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";

const ProsConsList = (props) => {
    const {list, type} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getProps = () => {
        switch (type) {
            case "pros":
                return {
                    icon: `fa-check`,
                    className: "text-success"
                }
            case "cons":
                return {
                    icon: `fa-times`,
                    className: "text-danger"
                };
        }
    }


        return (
            <>
                {Array.isArray(list) &&
                    <div className={`pros-cons ${type}`}>
                        <ul className={"pros-cons__ul fa-ul"}>
                            {list.map((item, index) => (
                                <li className="pros-cons__ul__li" key={index}>
                            <span className="fa-li pros-cons__ul__li--icon">
                                <i {...getProps()} />

                                <FontAwesomeIcon icon={faAngleRight} />
                            </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            </>
        );
};
ProsConsList.category = 'widgets';
ProsConsList.templateId = 'prosConsList';
export default ProsConsList;
