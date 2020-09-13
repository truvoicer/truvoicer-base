export const UserAccountDetailsData = (
    showPassword = true,
    display_name,
    nicename,
    nickname,
    firstname,
    lastname,
    email
) => {
    let data = {
        fields: [
            {
                name: "display_name",
                label: "Display Name",
                fieldType: "text",
                type: "text",
                placeHolder: "Enter a display name",
                value: display_name,
                validation: {
                    rules: [
                        {
                            type: "alphanumeric"
                        },
                        {
                            type: "length",
                            min: 5,
                            max: 16
                        }
                    ]
                }
            },
            {
                name: "nicename",
                label: "Nicename",
                type: "text",
                fieldType: "text",
                placeHolder: "Enter a nice name",
                value: nicename,
                validation: {
                    rules: [
                        {
                            type: "allow_empty"
                        },
                        {
                            type: "email_alphanumeric"
                        },
                        {
                            type: "length",
                            min: 5,
                            max: 16
                        }
                    ]
                }
            },
            {
                name: "nickname",
                label: "Nickname",
                type: "text",
                fieldType: "text",
                placeHolder: "Enter your nick name",
                value: nickname,
                validation: {
                    rules: [
                        {
                            type: "allow_empty"
                        },
                        {
                            type: "alphanumeric"
                        },
                        {
                            type: "length",
                            min: 5,
                            max: 16
                        }
                    ]
                }
            },
            {
                name: "first_name",
                label: "First Name",
                type: "text",
                fieldType: "text",
                placeHolder: "Enter your first name",
                value: firstname,
                validation: {
                    rules: [
                        {
                            type: "allow_empty"
                        },
                        {
                            type: "alphanumeric"
                        },
                        {
                            type: "length",
                            min: 5,
                            max: 16
                        }
                    ]
                }
            },
            {
                name: "last_name",
                label: "Last Name",
                type: "text",
                fieldType: "text",
                placeHolder: "Enter your last name",
                value: lastname,
                validation: {
                    rules: [
                        {
                            type: "allow_empty"
                        },
                        {
                            type: "alphanumeric"
                        },
                        {
                            type: "length",
                            min: 5,
                            max: 16
                        }
                    ]
                }
            },
            {
                name: "email",
                label: "Email",
                type: "email",
                fieldType: "text",
                placeHolder: "Enter your email",
                value: email,
                validation: {
                    rules: [
                        {
                            type: "email"
                        },
                    ]
                }
            },
        ]
    }

    if (showPassword) {
        data.fields.push(
            {
                name: "current_password",
                label: "Enter Password",
                type: "password",
                fieldType: "text",
                field: "input",
                placeHolder: "",
                validation: {
                    rules: [
                        {
                            type: "required"
                        },
                    ]
                }
            },
            {
                label: "Change Password?",
                name: "change_password",
                fieldType: "checkbox",
                value: "1",
                checkboxType: "true_false",
                subFields: [
                    {
                        dependsOn: {
                            field: "change_password",
                            value: true
                        },
                        name: "new_password",
                        label: "New Password",
                        type: "password",
                        fieldType: "text",
                        placeHolder: "",
                        validation: {
                            rules: [
                                {
                                    type: "password",
                                    allowedChars: ["alphanumeric", "symbols"]
                                },
                                {
                                    type: "length",
                                    min: 5,
                                    max: 16
                                }
                            ]
                        }
                    },
                    {
                        dependsOn: {
                            field: "change_password",
                            value: true
                        },
                        name: "confirm_password",
                        label: "Confirm password",
                        type: "password",
                        fieldType: "text",
                        placeHolder: "",
                        validation: {
                            rules: [
                                {
                                    type: "match",
                                    matchField: "new_password",
                                },
                            ]
                        }
                    },
                ]
            },
        )
    }
    return data;
}