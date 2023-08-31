export function updateStateObject({key, value, setStateObj})  {
    setStateObj(prevState => {
        let clonePrevState = {...prevState};
        clonePrevState[key] = value;
        return clonePrevState;
    })
}
export function updateStateNestedObjectData({object, key, value, setStateObj}) {
    setStateObj(prevState => {
        let clonePrevState = {...prevState};
        let cloneObject = {...clonePrevState[object]};
        cloneObject[key] = value;
        clonePrevState[object] = cloneObject;
        return clonePrevState;
    })
}
