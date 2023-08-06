import React from 'react';
import FormBlock from "../../../blocks/form/FormBlock";
import {isObject} from "@/truvoicer-base/library/utils";

function EducationForm(props) {
    if (!isObject(props?.data?.form_block)) {
        return null;
    }
    return (
        <>
            <FormBlock data={props.data.form_block} />
        </>
    );
}

export default EducationForm;
