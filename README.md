# Dark Crunchyroll Plugin
[![Build Status](https://travis-ci.org/tholinka/Dark-Crunchyroll-Plugin.svg?branch=master)](https://travis-ci.org/tholinka/Dark-Crunchyroll-Plugin)

This project is originally based off of the [Dark Youtube Plugin](https://github.com/stormbreakerbg/Dark-youtube-plugin-chrome).

This plugin is currently available on the [Firefox Addon Store](https://addons.mozilla.org/en-US/firefox/addon/dark-skin-crunchyroll), the [Chrome Web Store](https://chrome.google.com/webstore/detail/dark-skin-for-crunchyroll/agjiicokbioponboibkfhfgmhcacafph), the [Opera Addon Store](https://addons.opera.com/en/extensions/details/dark-skin-for-crunchyroll/), and the [Microsoft Edge Extension Store](https://www.microsoft.com/en-us/store/p/dark-skin-for-crunchyroll/9nv1zg95rh2d) 

This plugin aims to provide a quality dark theme for [Crunchyroll.com](https://crunchyroll.com).  This is primarly because dark themes are easier on the eye when in a darker environment.
It also leaves a button in the addon bar to quickly disable and reenable the theme.

If there are any unthemed pages, or other issues such as weird color choices, please report them!

See [Releases](https://github.com/tholinka/Dark-Crunchyroll-Plugin/releases) for changelog.

# Build

## Setup

1. Install latest stable `Node.js`
2. `npm install -g gulp-cli`
3. `npm install`
4. Run `gulp` for automatic build-on-change and css lint
5. Load the plugin in Chrome from the `build` directory

## CSS processing

The CSS files use SCSS and must be named `src/styles/<component-or-page>.css.scss`.
Any mixins reside in `src/styles/_mixins.scss` and the variables are in `src/styles/_variables.scss`.

**Do not add color literals (hex or rgba) in any file except `_variables.scss`.**
If possible, use the already existing colors there and "remix" them with functions such as
`rgba($color, 0.4)`, `lighten($color, 30%)` and `darken($color, 20%)`.

At the start of each new scss file put `@import 'common';`, which imports the variables and the mixins.

# Contribution guide

1. Clone the project
2. Follow the `Setup` instructions above
3. Make changes
4. Make sure there are no lint errors (`gulp lint` must not give warnings)
5. Test the changes in your browser (don't forget to reload the plugin)
6. Submit a PR with a short description **and a screenshot of the change**
