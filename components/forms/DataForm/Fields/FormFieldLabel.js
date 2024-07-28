import React from 'react';

function FormFieldLabel({errors, field}) {
    return (
        <>
            {field.label &&
                <>
                    {field.label}
                    <label className="text-black" htmlFor={field.name}>
                        <span className={"text-danger site-form--error--field"}>
                            {errors[field.name]}
                        </span>
                    </label>
                </>
            }
        </>
    );
}

export default FormFieldLabel;
