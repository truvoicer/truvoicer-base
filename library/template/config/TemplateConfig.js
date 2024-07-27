import {templateConfig} from "@/config/template-config";

export class TemplateConfig {
    config = {};
    constructor(config) {
        this.config = templateConfig();
    }

    getConfig() {
        return this.config;
    }

    addConfig(key, value) {
        this.config[key] = value;
    }

}
