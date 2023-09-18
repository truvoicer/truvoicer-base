export function buildComponent(component, props = {}) {
    const Component = component;
    return <Component {...props}/>
}
