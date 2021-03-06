var spawn = require('child_process').spawn;

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var nodemon = require('gulp-nodemon');
var babelify = require('babelify');
//var babel = require('gulp-babel');
//var sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', function () {
    return browserify({
        entries: [
            './public/cutlist.js',
            './public/editable-select.js',
            './public/editable-input.js',
            './public/editable-toggle.js'
        ],
        debug: true
    }).transform(babelify)
        .bundle()
        .pipe(source('./public/cutlist.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dev', ['browserify'], function () {
    return nodemon({exec: './node_modules/babel-cli/bin/babel-node.js main.js', ext: 'js json', ignore: ['*.swp', '*~', '.git/', 'dist/', 'node_modules/', 'tmp-test/'], env: {'NODE_ENV': 'development'}/*, verbose: true*/}).on('restart', function () {
        console.log('restart');
        gulp.run('browserify');
    });
});

gulp.task('prod', ['babel-node']);

gulp.task('babel-node', ['browserify'], function () {
    var server = spawn('./node_modules/babel-cli/bin/babel-node.js', ['main.js']);

    server.stdout.on('data', function (data) {
          process.stdout.write(data.toString());
    });

    server.stderr.on('data', function (data) {
          process.stderr.write(data.toString());
    });

    server.on('close', function (code) {
          console.log('server process exited with code ' + code);
    });

    return server;
});
