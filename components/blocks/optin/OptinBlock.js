import React from 'react';
import FormOptin from "./form-optin/FormOptin";

const OptinBlock = ({data}) => {
    const getOptin = (data) => {
        switch (data?.optin_type) {
            case "form":
                return <FormOptin data={data} />
            default:
                return null;
        }
    }
    return (
        <>
        {getOptin(data)}
        </>
    );
}

export default OptinBlock;