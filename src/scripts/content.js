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

const interval = setInterval(() => {
    if (document.querySelector('body > *')) {
        try {
            const styleSwitcher = new StyleSwitcher();

            port.onMessage.addListener((status) => {
                if (typeof status !== 'undefined') {
                    styleSwitcher.switch(status);
                }
            });

            port.postMessage({ method: 'notifyActiveStatus', args: {} });
        } finally {
            clearInterval(interval);
        }
    }
}, 100);