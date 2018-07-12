'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
var liveServer = require("live-server");
const concat = require('gulp-concat');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

var paths = {
    sass: './www/**/*.scss',
    ts: './app/*.ts'
}

gulp.task("ts", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['app/index.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(source('compiled.js'))
    .pipe(gulp.dest("./www/js/dist"));
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', ['ts', 'sass'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.ts, ['ts']);
});

gulp.task('serve', ['watch'], function() {
    console.log("Serving on localhost:8008")
    var params = {
        port: 8008, // Set the server port. Defaults to 8080.
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: "www", // Set root directory that's being served. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
        file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
        wait: 0, // Waits for all changes, before reloading. Defaults to 0 sec.
        logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
    };
    liveServer.start(params);
})
