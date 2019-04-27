const configStore = new ConfigStore(), messenger = new Messenger(chrome.runtime);

// get config out of store, and handle undefined cases
function toggle() {
	let config = configStore.get();

	config.active = !config.active

	configStore.set(config);

	// figure out which icons to use
	const iconName = "images/" + (config.active ? "dark" : "white") + "_crunchyroll_", iconEnd = ".png";
	const sizes = ["16", "48", "64", "128"];
	const icons = {
		path: {
		}
	}

	// setup icons to be used
	for (var i = 0; i < sizes.length; i++) {
		icons.path[sizes[i]] = iconName + sizes[i] + iconEnd;
	}

	// tell chrome to pick an icon
	chrome.browserAction.setIcon(icons);

	// notify existing pages
	messenger.notify(config.active);
}

// have messenger respond to requests from crunchyroll pages
messenger.onMessage((request) => {
	// request isn't bad
	if (typeof request != typeof undefined && typeof request != null) {
		// request is for request for status
		if (request.method === "requestActiveStatus") {
			// respond to message with active
			messenger.notify(configStore.get().active)
		}
	}
});

// have chrome notify on icon click
chrome.browserAction.onClicked.addListener(() => toggle());
