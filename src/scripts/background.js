const configStore = new ConfigStore(), messenger = new Messenger(chrome.runtime);

// get config out of store, and handle undefined cases


function toggle() {
    let config = configStore.get();

    config.active = !config.active

    configStore.set(config);

    // set icon
    let icon = config.active ? 'images/dark_crunchyroll_128.png' : 'images/white_crunchyroll_128.png';
    chrome.browserAction.setIcon({ path: icon });

    // notify existing pages
    messenger.notify(config.active);
}

// have messanger respond to requests from crunchyroll pages
messenger.onMessage((request) => {
    // request isn't bad
    if (typeof request != typeof undefined && typeof request != null) {
        // request is for request for status
        if (request.method === "notifyActiveStatus") {
            // respond to message with active
            messenger.notify(configStore.get().active)
        }
    }
});

// have chrome notify on icon click
chrome.browserAction.onClicked.addListener(() => toggle());