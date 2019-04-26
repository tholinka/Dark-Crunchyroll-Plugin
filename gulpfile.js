const { src, dest, series, parallel, watch } = require('gulp');
const gulp = require('gulp'),
	zip = require('gulp-zip'),
	sass = require('gulp-sass'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	postcss = require('gulp-postcss'),
	sassLint = require('gulp-sass-lint'),

	del = require('del'),

	PATHS = {
		content_script: 'src/scripts/content.js',
		background_scripts: 'src/scripts/background/**/*',
		background_script: 'src/scripts/background.js',
		styles: 'src/styles/**/*.scss',
		legacy_styles: 'src/legacy_styles.css',
		static: 'static/',
		build: 'build/',
		zip: 'build/dark-crunchyroll.zip'
	};

function clean() {
	return del(PATHS.build + "/**/*");
}

function lint() {
	return src(PATHS.styles)
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
}

function buildStyles() {
	return src(PATHS.styles)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('styles.css', { newLine: "\n" }))
		.pipe(postcss([require('./add_important.js')()]))
		.pipe(dest(PATHS.build));
}

function buildStylesAddLegacy() {
	return src([PATHS.legacy_styles, PATHS.build + "styles.css"])
		.pipe(concat('styles.css', { newLine: "\n" }))
		.pipe(dest(PATHS.build));
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

function packageZip() {
	const zipPaths = [
		PATHS.build + "**/*",
		"!" + PATHS.zip,
		"!dark-crunchyroll.zip"
	];

	return src(zipPaths, { base: PATHS.build })
		.pipe(zip('dark-crunchyroll.zip'))
		.pipe(dest(PATHS.build));
}

const scripts = parallel(buildBackgroundScripts, buildContentScripts);
const buildAll = parallel(scripts, series(buildStyles, buildStylesAddLegacy), buildStaticContent);

exports.build = series(clean, lint, buildAll);
exports.package = series(exports.build, packageZip);

exports.watch = series(exports.build, function () {
	watch([
		PATHS.content_script,
		PATHS.background_scripts,
		PATHS.background_script,
		PATHS.styles
	], exports.build);
});

exports.default = exports.watch;
