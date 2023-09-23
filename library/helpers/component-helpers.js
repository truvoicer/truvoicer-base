import {isFunction} from "underscore";
import {isComponentFunction} from "@/truvoicer-base/library/utils";

export function buildComponent(component, props = {}) {
    if (!isComponentFunction(component)) {
        return null;
    }
    return component;
}
