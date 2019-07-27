// A greesemonkey / tampermonkey script to set the default video quality on the html5 player
// ==UserScript==
// @name Crunchyroll Default Video Quality
// @version 1.0.0
// @namespace tholinka/cdvq
// @description Sets the default quality on the crunchyroll html5 player - based off of https://greasyfork.org/en/scripts/374477-crunchyroll-video-utilities
// @match https://static.crunchyroll.com/vilos/player.html
// @grant GM_registerMenuCommand
// @require https://gitcdn.xyz/cdn/fuzetsu/userscripts/b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
// @require https://gitcdn.xyz/cdn/kufii/My-UserScripts/fa4555701cf5a22eae44f06d9848df6966788fa8/libs/gm_config.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
/* globals unsafeWindow, GM_config, GM_registerMenuCommand, waitForElems */

const CSS = {
	quality: '.qualityMenuItemSelector',
	settings: '.settingsMenuButton'
}
const querySelectorArray = (q, c) => Array.from((c || document).querySelectorAll(q))
const querySelector = (q, c) => (c || document).querySelector(q)

const config = GM_config([{
	key: 'quality',
	label: 'Quality',
	type: 'dropdown',
	values: ['auto', 360, 480, 720, 1080],
	default: 1080
}])

let cfg = config.load()

config.onsave = newCfg => {
	cfg = newCfg
	setQuality(cfg.quality)
}

// const prevent = (e, fn) => (e.preventDefault(), fn(e))
const applyStyle = (elem, styles) => Object.entries(styles).map(([k, v]) => (elem.style[k] = v))

let isFullscreen = false

function setQuality(quality) {
	const btn = quality === 'auto' ? querySelectorArray(CSS.quality)[2] :
		querySelectorArray(CSS.quality).slice(2).find(item => quality >= parseInt(item.textContent))

	if (btn) {
		// this causes the menu to open
		btn.click()
		// so close it after a short delay
		setTimeout(toggleSettings, 300)
	}
}

function toggleSettings() {
	const btn = querySelector(CSS.settings)
	btn.click()
}

// can only set quality from the player frame since the button is in its dom
waitForElems({
	stop: true,
	sel: CSS.quality + '.selected',
	onmatch: elem => {
		if (elem.textContent.toLowerCase().includes(cfg.quality)) {
			console.log('configured default already selected')
			return false
		}

		setQuality(cfg.quality)
	}
})

GM_registerMenuCommand('Crunchyroll Video Utilities - Config', config.setup)
