export const ChangePasswordFormFields = () => {
    return [
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
                    name: "current_password",
                    label: "Enter Password",
                    type: "password",
                    fieldType: "text",
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
        }
    ];
}