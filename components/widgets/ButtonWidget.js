import React from 'react';
import AuthButton from "./Buttons/AuthButton";

const ButtonWidget = (props) => {
    const getButton = () => {
        switch (props.data.button_type) {
            case "auth":
                return <AuthButton data={props.data} />
        }
    }
    return (
        <>
            {getButton()}
        </>
    );
}
export default ButtonWidget;
