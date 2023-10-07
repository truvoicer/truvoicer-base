import {isNotEmpty, isObjectEmpty} from "@/truvoicer-base/library/utils";

export class AppManager {
    constructor(appContext) {
        this.appContext = appContext;
    }

    updateContext({key, value}) {
        this.appContext.updateData({key, value})
    }

    updateAppContexts({key, value}) {
        this.appContext.updateAppContexts({key, value})
    }

    findAppContextById(contextGroupName, contextId) {
        const contextGroup = this.appContext.contexts?.[contextGroupName];
        if (typeof contextGroup !== 'object' || isObjectEmpty(contextGroup)) {
            return false;
        }
        const context = contextGroup?.[contextId];
        if (isNotEmpty(context)) {
            return context;
        }
        return false;
    }

    findContextGroupsByContextId(contextId) {
        const appContexts = this.appContext.contexts;
        let contexts = [];
        Object.keys(appContexts).forEach(key => {
            if (appContexts?.[key]?.[contextId]) {
                contexts.push(appContexts[key]);
            }
        });
        return contexts;
    }
}
