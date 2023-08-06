import React from 'react';
import AuthButton from "./Buttons/AuthButton";
import CustomButton from "./Buttons/CustomButton";

const ButtonWidget = (props) => {
    const getButton = () => {
        switch (props.data.button_type) {
            case "auth":
                return <AuthButton data={props.data} />
            case "custom":
                return <CustomButton data={props.data} />
        }
    }
    return (
    <>
        {getButton()}
    </>
    );
}
export default ButtonWidget;
