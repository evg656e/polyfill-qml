const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const { exec } = require('child_process');

gulp.task('check-qmltestrunner', function (cb) {
    exec('qmltestrunner -help', function (err) {
        if (err) {
            console.error('qmltestrunner in not found. To run tests add qmltestrunner to environment path.');
            return cb(err);
        }
        cb();
    });
});

gulp.task('build-tests', function () {
    return gulp.src('test/tst_*.ts')
        .pipe(named())
        .pipe(webpackStream(require('./config/webpack/webpack.config'), webpack))
        .pipe(gulp.dest('test/build'));
});

gulp.task('test', ['check-qmltestrunner', 'build-tests'], function (cb) {
    exec('qmltestrunner -input test', function (err, stdout, stderr) {
        console.log(stdout);
        console.warn(stderr);
        cb(err);
    });
});
