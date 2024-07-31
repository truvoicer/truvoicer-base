import {createContext} from "react";

export const userAccountData = {
    'profile_picture': null,
    'first_name': null,
    'surname': null,
    'user_email': null,
    'display_name': null,
    'telephone': null,
    'user_registered': null,
    'saved_jobs_count': null,
    'skills': null,
    'short_description': null,
    'personal_statement': null,
    'town': null,
    'country': null,
    'updateData': () => {},
    'updateNestedObjectData': () => {}
}
export default createContext(userAccountData);
