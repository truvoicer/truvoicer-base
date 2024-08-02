import {fields} from "@/truvoicer-base/library/user-account/fields";

export class UserAccountHelpers {
    static getFields(names = null) {
        if (!names) {
            return fields;
        }
        return fields.filter(field => names.includes(field.name));
    }
}
