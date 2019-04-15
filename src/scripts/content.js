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

	switch(active) {
		if (active) {
			this.activate();
		} else {
			this.deactivate();
		}
	}
}

const port = chrome.runtime.connect({ name: 'dark-crunchyroll' });

// wait until page is loaded, because if we apply to soon the theme doesn't get applied
const bodyInterval = setInterval(() => {
	// page is loaded (enough for us to load anyway), if the body tag has elements
	if (document.querySelector('body > *')) {
		// page is loaded, we don't need to repeat anymore
		clearInterval(bodyInterval);

		// StyleSwitcher can be successfully constructed since page is loaded
		const styleSwitcher = new StyleSwitcher();

		// assume we're enabled until we hear back
		styleSwitcher.activate();

		// keep asking until we get a good response
		const requestInterval = setInterval(() => {
			// ask background page for our actual status
			try {
				port.onMessage.addListener((status) => {
					// response is good
					if (typeof status != typeof undefined && typeof status != null) {
						styleSwitcher.switch(status);
					}
				});

				// request status from background
				port.postMessage({ method: 'requestActiveStatus', args: {} });
			} finally {
				clearInterval(requestInterval);
			}
		}, 10);
	}
}, 5);
