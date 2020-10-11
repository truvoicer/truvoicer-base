export const PasswordResetRequestData = {
    fields: [
        {
            name: "username",
            fieldType: "text",
            type: "text",
            placeHolder: "Enter your username or email",
            value: "",
            validation: {
                rules: [
                    {
                        type: "email_alphanumeric"
                    },
                    {
                        type: "length",
                        min: 5,
                        max: 100
                    }
                ]
            }
        },
    ]
}