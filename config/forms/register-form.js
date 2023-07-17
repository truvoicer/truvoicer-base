export const RegisterFormData = {
    fields: [
        {
            name: "username",
            label: "Username",
            fieldType: "text",
            type: "text",
            placeHolder: "Enter a username",
            value: "",
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
            name: "email",
            label: "Email",
            type: "email",
            fieldType: "text",
            placeHolder: "Enter your email",
            value: "",
            validation: {
                rules: [
                    {
                        type: "email"
                    },
                ]
            }
        },
        {
            name: "password",
            label: "Password",
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
            name: "password_confirmation",
            label: "Confirm password",
            type: "password",
            fieldType: "text",
            placeHolder: "",
            validation: {
                rules: [
                    {
                        type: "match",
                        matchField: "password",
                    },
                ]
            }
        },
    ]
}
