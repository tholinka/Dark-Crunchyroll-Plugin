class StyleSwitcher {
	constructor() {
		this.head = document.getElementsByTagName('head')[0];
		this.link = document.createElement('link');

		this.link.id = 'dark-crunchyroll-styles';
		this.link.rel = 'stylesheet';
		this.link.type = 'text/css';
		this.link.href = chrome.extension.getURL('styles.css');;
		this.link.media = 'screen';

		this.active = false;
	}

	activate() {
		if (this.active) {
			return;
		}

		this.active = true;
		this.head.appendChild(this.link);
	}

	deactivate() {
		if (!this.active) {
			return;
		}

		this.active = false;
		this.head.removeChild(this.link);
	}

	switch (active) {
		active ? this.activate() : this.deactivate();
	}
}


// StyleSwitcher can be successfully constructed since page is loaded
const styleSwitcher = new StyleSwitcher();

// assume we're enabled until we hear back
styleSwitcher.activate();

const port = chrome.runtime.connect({
	name: 'dark-crunchyroll'
});

// send ask
function message() {
	// request status from background
	port.postMessage({
		method: 'requestActiveStatus',
		args: {}
	});
}

port.onMessage.addListener((status) => {
	// response is good
	if (typeof status === 'boolean') {
		styleSwitcher.switch(status);

	} else {
		console.error('Dark-Crunchyroll: bad response', status);
		// keep asking until we get a good response
		message();
	}
});

// actually send ask
message();
