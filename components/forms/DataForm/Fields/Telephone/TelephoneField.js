import React from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const TelephoneField = ({
                            name,
                            callback,
                            arrayFieldIndex = false,
                            value = null,
                            placeholder = ""
                        }) => {
    return (
        <div className={"tel-field"}>
            <PhoneInput
                containerClass={"tel-field--container"}
                buttonClass={"tel-field--button"}
                inputClass={"text-input tel-field--input"}
                dropdownClass={"tel-field--dropdown"}
                placeholder={placeholder}
                country={'gb'}
                value={value}
                onChange={phone => callback(name, phone, arrayFieldIndex)}
            />
        </div>
    );
};

export default TelephoneField;
