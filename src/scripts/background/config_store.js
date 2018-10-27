// handles localstorage
class ConfigStore {
    defaults() {
        return {
            active: true
        };
    }

    get() {
        var config = localStorage.getItem('crunchyroll_skin');

        if (!config) {
            return this.defaults();
        }

        return JSON.parse(config);
    }

    set(config) {
        var current = this.get();

        Object.keys(config).forEach((key) => { current[key] = config[key]; });

        this.replace(config);
    }

    replace(config) {
        localStorage.setItem('crunchyroll_skin', JSON.stringify(config));
    }
}
