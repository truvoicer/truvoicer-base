export class TemplateConfig {
    config = {};
    constructor(config) {
        this.config = config
    }

    getConfig() {
        return this.config;
    }

    addConfig(key, value) {
        this.config[key] = value;
    }
    addListingConfig({
        displayAs,
        service,
        template,
        props
    }) {
        this.config.listings.grid[displayAs][service].templates[template] = props;
    }
}
