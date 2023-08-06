import React from 'react';

const WPErrorDisplay = ({errorData = []}) => {
    return (

        <div className="bg-white">
            {errorData.map((response, index) => {
                if (!response?.errors) {
                    return null;
                }
                return (
                    <React.Fragment key={index}>
                        {Object.keys(response.errors).map((key, errorIndex) => {
                            if (!Array.isArray(response.errors[key])) {
                                return null;
                            }
                            return (
                                <React.Fragment key={errorIndex}>
                                    {response.errors[key].map((text, textIndex) => {
                                    return (
                                        <React.Fragment key={textIndex}>
                                            <p className={"text-danger text-danger"}>{text}</p>
                                        </React.Fragment>
                                    )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    );
};

export default WPErrorDisplay;
