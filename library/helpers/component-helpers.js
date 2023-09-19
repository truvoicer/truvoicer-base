import {isFunction} from "underscore";

export function buildComponent(component, props = {}) {
    if (!isFunction(component) && !isFunction(component?.type)) {
        return null;
    }
    const Component = component;
    return <Component {...props}/>
}
