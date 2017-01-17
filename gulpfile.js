var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transform JSX to JS
var source = require('vinyl-source-stream'); // Use Conventional Streams with Gulp
var concat = require('gulp-concat'); // concatenates files
var eslint = require('gulp-eslint'); // Lint JS files, includinf JSX

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		dist: './dist',
		mainJS: './src/main.js'
	}
};

//Start a local development server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// Move Html files to dist folder and reload app
gulp.task('html', function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

/**
 *  JS Task : Transform JSX to JS using reactify module
 *  if there's an error while tronsforming, print it in console
 *  combine all JSX, JS files to a single js file (bundle.js)
 *  Move bundle.js to dist folder
 *  Reload app to have the latest update of js code.a
 */
gulp.task('js', function(){
	browserify(config.paths.mainJS).transform(reactify)
								   .bundle()
								   .on('error', console.error.bind(console))
								   .pipe(source('bundle.js'))
								   .pipe(gulp.dest(config.paths.dist+'/scripts'))
								   .pipe(connect.reload());
});

/**
 * CSS Task :
 * load Bootstrap css from node_module
 * concat all css file to bundle.css
 * move to dist folder
 */
gulp.task('css', function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist+'/css'));
});

/**
 * eslint task ;
 * Configure eslint for adding rules lint to project
 */
gulp.task('lint', function(){
	return gulp.src(config.paths.js)
			   .pipe(eslint({configFile: 'eslint.config.json'}))
		       .pipe(eslint.format());
});

/**
 * 1. Listen to any change on HTML Files
 *    fire the HTML task after change event
 * 2. Listen to any change on JS Files
 *    fire the JS task after change event
 * 3. Once JS files has been changed, run lint task again
 */
gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html','js', 'css', 'lint', 'open', 'watch']);
