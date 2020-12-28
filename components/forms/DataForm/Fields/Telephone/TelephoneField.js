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
        <PhoneInput
            placeholder={placeholder}
            country={'gb'}
            value={value}
            onChange={phone => callback(name, phone, arrayFieldIndex)}
        />
    );
};

export default TelephoneField;
