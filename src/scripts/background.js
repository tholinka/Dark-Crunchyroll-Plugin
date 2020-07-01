const configStore = new ConfigStore(),
	messenger = new Messenger(chrome.runtime);

const ICONS = Object.freeze({
	white: {
		path: {
			'16': 'images/white_crunchyroll_16.png',
			'48': 'images/white_crunchyroll_48.png',
			'64': 'images/white_crunchyroll_64.png',
			'128': 'images/white_crunchyroll_128.png',
		},
	},
	dark: {
		path: {
			'16': 'images/dark_crunchyroll_16.png',
			'48': 'images/dark_crunchyroll_48.png',
			'64': 'images/dark_crunchyroll_64.png',
			'128': 'images/dark_crunchyroll_128.png',
		},
	},
})


// get config out of store, and handle undefined cases
function toggle() {
	const config = configStore.get();

	config.active = !config.active

	configStore.set(config);

	// tell chrome to pick an icon
	chrome.browserAction.setIcon(config.active ? ICONS.dark : ICONS.white);

	// notify existing pages
	messenger.notify(config.active);
}

// have messenger respond to requests from crunchyroll pages
messenger.onMessage((request) => {
	// respond to message with active
	messenger.notify(configStore.get().active)
});

// have chrome notify on icon click
chrome.browserAction.onClicked.addListener(() => toggle());
