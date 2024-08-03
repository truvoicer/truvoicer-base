import {isNotEmpty} from "@/truvoicer-base/library/utils";

export class FormHelpers {
    values = {};

    constructor() {

    }

    buildFormItem(item) {
        if (!this.values.hasOwnProperty(item.name)) {
            return item;
        }
        let cloneItem = {...item};
        cloneItem.value = this.values?.[item.name];
        return cloneItem;
    }

    setValues(values) {
        this.values = values;
    }
    getValues() {
        return this.values;
    }
    init() {
        return new FormHelpers();
    }
}
