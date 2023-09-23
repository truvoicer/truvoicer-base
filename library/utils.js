import moment from 'moment';
import {menuIcons} from "../../config/menu-icons";
import {isFunction} from "underscore";

export const formatDate = (dateString, formatString = "Do MMMM YYYY") => {
    moment.updateLocale('en', {
        invalidDate : ""
    });
    if (!isSet(dateString) || dateString === null || dateString === "") {
        return dateString;
    }
    let date;
    if (!isNaN(dateString)) {
        date = moment(dateString*1000).format(formatString);

    } else {
        date = moment(dateString).format(formatString);
    }
    if (isSet(date)) {
        return date;
    }
    return dateString
}

export const isEmpty = (object) => {
    for(let key in object) {
        if(object.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const isSet = (item) => {
    return typeof item !== "undefined";
}
export const isFile = (item) => {
    return Object.prototype.toString.call(item) === "[object File]";
}

export const isNotEmpty = (item) => {
    return typeof item !== "undefined" && item !== null && item !== "" && item !== false;
}

export const imageSelector = (imageSize = "medium", imageArray = []) => {

    if (!Array.isArray(imageArray)) {
        return false;
    }
    if (imageArray.length === 0) {
        return false;
    }
    let sizes = {
        xsmall: {min: 0, max: 50},
        small: {min: 51, max: 100},
        medium: {min: 101, max: 600},
        large: {min: 601, max: 2048},
        xlarge: {min: 2049, max: 6000}
    }
    let image = imageArray.filter((item) => {
        if (item.width >= sizes[imageSize].min && item.width <= sizes[imageSize].max) {
            return true;
        }
    })
    if (image.length > 0) {
        return image[0];
    } else {
        return imageArray[0];
    }
}

export const convertImageObjectsToArray = (imagesArray) => {
    if (typeof imagesArray === "object" && imagesArray !== null) {
        return Object.keys(imagesArray).map(key => imagesArray[key])
    }
    return imagesArray;
}

export const getDefaultImage = (item) => {
    if (isSet(item.image_list) && item.image_list !== null) {
        let selectImage = imageSelector("medium", item.image_list);
        if (selectImage) {
            return selectImage.url;
        }
    }
    if (isSet(item.item_default_image) && item.item_default_image !== "") {
        return item.item_default_image;
    }
    return null;
}

export const uCaseFirst = (string) => {
    if (!isNotEmpty(string)) {
        return ""
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isObjectEmpty = (object) => {
    if (!isSet(object)) {
        return false;
    }
    return Object.keys(object).length === 0 && object.constructor === Object
}

export const isObject = (object) => {
    return typeof object === "object";
}

export const scrollToRef = (ref) => {
    window.scrollTo(0, ref.current.offsetTop)
}

export const getFontAwesomeMenuIcon = (menuName, iconName, defaultIcon) => {
    const getMenuIcons = menuIcons[menuName];
    if (!getMenuIcons) {
        return defaultIcon;
    }
    const getIconClass = getMenuIcons[iconName];
    if (!getIconClass) {
        return getMenuIcons?.default || defaultIcon;
    }
    return getIconClass;
}
export const getAcceptedMimeTypesObject = (allowedExtArray = null) => {
    let dataObject = {};
    if (allowedExtArray === null) {
        return dataObject;
    }
    allowedExtArray.forEach(type => {
        const mimeType = type?.mime_type;
        let extension = type?.extension;
        if (!isNotEmpty(mimeType)) {
            return;
        }
        if (!isNotEmpty(extension)) {
            return;
        }
        if (extension.charAt(0) !== ".") {
            extension = "." + extension;
        }
        if (!dataObject?.[mimeType]) {
            dataObject[mimeType] = [];
        }
        if (!dataObject[mimeType].includes(extension)) {
            dataObject[mimeType].push(extension);
        }
    });
    return dataObject;
}
export const getAcceptedFileExtString = (allowedExtArray = null, allowedMessage) => {
    if (allowedExtArray === null) {
        return '';
    }
    const joinAcceptedFiles = allowedExtArray.map(type => type.extension).join(", ");
    return allowedMessage.replace("[accepted]", joinAcceptedFiles)
}

export function isComponentFunction(component) {
    return (component || isFunction(component) || isFunction(component?.type));
}
