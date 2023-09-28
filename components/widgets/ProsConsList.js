import React, {useContext} from 'react';
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ProsConsList = ({list, type}) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const getProps = () => {
        let iconClass;
        switch (type) {
            case "pros":
                iconClass = "fa-check text-success";
                break;
            case "cons":
                iconClass = "fa-times text-danger";
                break;
        }
        return {
            className: `fas ${iconClass}`
        }
    }

    function defaultView() {
    return (
        <>
            {Array.isArray(list) &&
            <div className={`pros-cons ${type}`}>
                <ul className={"pros-cons__ul fa-ul"}>
                    {list.map((item, index) => (
                        <li className="pros-cons__ul__li" key={index}>
                            <span className="fa-li pros-cons__ul__li--icon">
                                <i {...getProps()} />
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            }
        </>
    );
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
};

export default ProsConsList;
