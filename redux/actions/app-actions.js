import store from "../store"
import {
    setError,
    setAppLoaded
} from "../reducers/app-reducer";

export function setAppErrorAction(error) {
    store.dispatch(setError(error))
}
export function setAppLoadedAction(appLoaded) {
    store.dispatch(setAppLoaded(appLoaded))
}
