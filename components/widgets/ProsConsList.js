import React from 'react';

const ProsConsList = ({list, type}) => {

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
};

export default ProsConsList;
