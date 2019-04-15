const { series, parallel } = require('gulp');
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
		static: 'static/',
		build: 'build/',
		zip: 'build/dark-crunchyroll.zip'
	};

function clean() {

	return del(PATHS.build + "/**/*");
}

function lint() {
	return gulp
		.src(PATHS.styles)
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
}

function styles() {
	return gulp
		.src(PATHS.styles)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('styles.css', { newLine: "\n" }))
		.pipe(postcss([require('./add_important.js')()]))
		.pipe(gulp.dest(PATHS.build));
}

function scriptsBackground() {
	return gulp
		.src(PATHS.content_script)
		.pipe(babel())
		.pipe(concat('content_script.js', { newLine: "\n" }))
		.pipe(gulp.dest(PATHS.build));
}

function scriptsContent() {
	return gulp
		.src([PATHS.background_scripts, PATHS.background_script])
		.pipe(babel())
		.pipe(concat('background_script.js', { newLine: "\n" }))
		.pipe(gulp.dest(PATHS.build));
}

function extensionPrepare() {
	return gulp
		.src(PATHS.static + '**/*', { base: PATHS.static })
		.pipe(gulp.dest(PATHS.build));
}

function packageZip() {
	var zipPaths = [
		PATHS.build + "**/*",
		"!" + PATHS.zip,
		"!dark-crunchyroll.zip"
	];
	return gulp.src(zipPaths, { base: PATHS.build })
		.pipe(zip('dark-crunchyroll.zip'))
		.pipe(gulp.dest(PATHS.build));
}

exports.scripts = parallel(scriptsBackground, scriptsContent);
exports.build = series(clean, lint, styles, exports.scripts, extensionPrepare);
exports.package = series(exports.build, packageZip);


function watch() {
	gulp.watch([
		PATHS.content_script,
		PATHS.background_scripts,
		PATHS.background_script,
		PATHS.styles
	], exports.build);
}
exports.watch = series(exports.build, watch);

exports.default = exports.watch;
