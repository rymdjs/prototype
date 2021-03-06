var gulp = 			require('gulp');
var gutil = 		require('gulp-util');
var browserify = 	require('gulp-browserify');
var watch = 		require("gulp-watch");
var clean = 		require('gulp-clean');
var concat = 		require("gulp-concat");
var spawn = 		require('child_process').spawn;
var jshint = 		require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var notify = 		require("gulp-notify");
var sass = 			require('gulp-sass');

// Common build operation:
// 	Take main.js, add deps, concatenate into
// 	`bundle.js` and put in build directory.
function build(files) {
	gulp.src('./lib/app.js')
		.pipe(browserify())
		.on('error', notify.onError("<%= error.message%>"))
		.pipe(concat("bundle.js"))
		.pipe(gulp.dest("./build"));
}

function buildSass(files) {
	gulp.src("stylesheets/shuttle.scss")
			.pipe(sass())
			.on('error', notify.onError("<%= error.message%>"))
			.pipe(gulp.dest("./build"));
}


// Default task: build
gulp.task('default', ['build'], function(){

});

gulp.task('test', function () {
	// Use browser based testing and not a headless WebKit
	// proxy, since PhantomJS doesn't support IndexedDB as
	// of 1.9.x.
    spawn("open", ["test/runner.html"]);
});

// Watch source files and use Browserify to handle deps.
gulp.task('watch', function() {
	gulp.src("lib/**/*.js").pipe(watch(function(files) {
		return build(files);
	}));
	gulp.src("stylesheets/shuttle.scss").pipe(watch(function(files) {
		return buildSass(files);
	}));
});

gulp.task("sass", function(){
	buildSass();
});

gulp.task('build', ['clean', 'lint', 'sass'], function() {
    build();
});

gulp.task('clean', function() {
	gulp.src('./build', {read: false}).pipe(clean());
});

gulp.task('lint', function() {
	gulp.src('lib/**/*.js')
		.pipe(jshint("./.jshintrc"))
		.pipe(jshint.reporter(jshintStylish));
});
