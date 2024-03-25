import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, protectedApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {isSet} from "../../library/utils";

function UserTextReplacerWidget({text}) {
    const [textValue, setTextValue] = useState("");

    const getTextPlaceholders = (value) => {
        let matches;
        let array = [];
        const test = new RegExp("\\\[+(.*?)\\]", "gi");
        while (matches = test.exec(value)) {
            array.push(matches[1])
        }
        return array;
    }

    const buildRequestObject = (placeholdersArray) =>  {
        const fields = placeholdersArray.map(value => {
            return {
                form_control: "text",
                name: value
            }
        })
        return {
            form: {
                type: "single",
                fields: fields,
            }
        }
    }

    const replaceItemDataPlaceholders = (data, origText) => {
        if (!origText) {
            return origText;
        }
        const test = new RegExp("\\\[+(.*?)\\]", "g");
        return origText.replace(test, (match, value) => {
            if (isSet(data[value])) {
                return data[value];
            }
            return "loading..."
        });
    }

    const runReplacerRequest = async (placeholdersArray) => {
        const response = await protectedApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.formsUserMetaDataRequest),
            buildRequestObject(placeholdersArray),
            false
        )
        if (response.status === "success") {
            setTextValue(textValue => {
                return replaceItemDataPlaceholders(response.data, text);
            })
        }
    }

    useEffect(() => {
        const getReplaceArray = getTextPlaceholders(text);
        if (getReplaceArray === null) {
            setTextValue(text)
            return;
        }
        runReplacerRequest(getReplaceArray)
    }, [text]);

    return (
        <>
            {textValue}
        </>
    );
}

export default UserTextReplacerWidget;
