'use strict';

const { src, dest, series, parallel, watch } = require('gulp');
const gulp = require('gulp'),
	zip = require('gulp-zip'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	postcss = require('gulp-postcss'),
	sassLint = require('gulp-sass-lint'),
	replace = require('gulp-replace'),
	del = require('del'),

	PATHS = {
		content_script: 'src/scripts/content.js',
		background_scripts: 'src/scripts/background/**/*',
		background_script: 'src/scripts/background.js',
		styles: 'src/styles/**/*.scss',
		legacy_styles: 'src/legacy_styles.css',
		static: 'static/',
		build: 'build/',
	};

function clean() {
	return del(PATHS.build + "/**/*");
}

function lintStyles() {
	return src(PATHS.styles)
		.pipe(sassLint())
		.pipe(sassLint.format());
}

function buildStyles() {
	return src(PATHS.styles)
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(concat('styles.css', { newLine: "\n" }))
		.pipe(postcss([require('./add_important.js')()]))
		.pipe(dest(PATHS.build));
}

function buildStylesAddLegacy() {
	return src([PATHS.legacy_styles, PATHS.build + "styles.css"])
		.pipe(concat('styles.css', { newLine: "\n" }))
		.pipe(dest(PATHS.build));
}

function convertStylesURLsToFirefox() {
	return src(PATHS.build + "styles.css")
		.pipe(replace("chrome-extension:", "moz-extension:"))
		.pipe(gulp.dest(PATHS.build));
}

function buildBackgroundScripts() {
	return src(PATHS.content_script)
		.pipe(babel())
		.pipe(concat('content_script.js', { newLine: "\n" }))
		.pipe(dest(PATHS.build));
}

function buildContentScripts() {
	return src([PATHS.background_scripts, PATHS.background_script])
		.pipe(babel())
		.pipe(concat('background_script.js', { newLine: "\n" }))
		.pipe(dest(PATHS.build));
}

function buildStaticContent() {
	return src(PATHS.static + '**/*', { base: PATHS.static })
		.pipe(dest(PATHS.build));
}

function packageZip(name) {
	const zipPaths = [
		PATHS.build + "**/*",
		"!" + PATHS.build + "dark-crunchyroll*.zip"
	],
		zipName = "dark-crunchyroll-" + name + ".zip";
	return src(zipPaths, { base: PATHS.build })
		.pipe(zip(zipName))
		.pipe(dest(PATHS.build));
}

function doPackageChrome() {
	return packageZip("chrome");
}

function doPackageFirefox() {
	return packageZip("firefox");
}

exports.clean = clean;

const scripts = parallel(buildBackgroundScripts, buildContentScripts);
const minStyles = series(lintStyles, buildStyles);
const styles = series(minStyles, buildStylesAddLegacy);
const staticContent = buildStaticContent;

exports.buildChromeNoLegacy = parallel(scripts, minStyles, staticContent);

exports.buildChrome = parallel(scripts, styles, staticContent);
exports.buildFirefox = parallel(scripts, series(styles, convertStylesURLsToFirefox), staticContent);

exports.packageChrome = series(exports.clean, exports.buildChrome, doPackageChrome);

exports.packageFirefox = series(exports.clean, exports.buildFirefox, doPackageFirefox);

// when doing both packages, don't rebuild between packaging, just convert the existing build
exports.package = series(exports.packageChrome, convertStylesURLsToFirefox, doPackageFirefox);

// watches files and calls next on change
function watchFiles(next) {
	return watch([
		PATHS.content_script,
		PATHS.background_scripts,
		PATHS.background_script,
		PATHS.styles
	], next);
}

exports.watchChrome = series(exports.buildChrome, function () {
	watchFiles(exports.buildChrome)
});

exports.watchChromeNoLegacy = series(exports.buildChromeNoLegacy, function () {
	watchFiles(exports.buildChromeNoLegacy);
});

exports.watchFirefox = series(exports.buildFirefox, function () {
	watchFiles(exports.buildFirefox)
});

exports.default = exports.watchChrome;
