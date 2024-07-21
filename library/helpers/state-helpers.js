import {isObject} from "@/truvoicer-base/library/utils";

export class StateHelpers {
    static getStateData(useState) {
        const [stateObj, setStateObj] = useState;
        return stateObj;
    }
    static getSetStateData(useState) {
        const [stateObj, setStateObj] = useState;
        return setStateObj;
    }
    static updateStateObject({key, value, setStateObj}) {
        setStateObj(prevState => {
            let clonePrevState = {...prevState};
            clonePrevState[key] = value;
            return clonePrevState;
        })
    }

    static updateStateNestedObjectData({object, key, value, setStateObj}) {
        setStateObj(prevState => {
            let clonePrevState = {...prevState};
            let cloneObject = {...clonePrevState[object]};
            cloneObject[key] = value;
            clonePrevState[object] = cloneObject;
            return clonePrevState;
        })
    }
}

