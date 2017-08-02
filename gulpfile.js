const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const exec = require('child_process').exec;

gulp.task('build-tests', function() {
  return gulp.src('test/tst_*.js')
    .pipe(named())
    .pipe(webpackStream({
        output: {
            libraryTarget: "umd"
        }
    }))
    .pipe(gulp.dest('test/build'));
});

gulp.task('run-tests', ['build-tests'], function(cb) {
    exec('qmltestrunner -input test', function(err, stdout, stderr) {
        console.log(stdout);
        console.warn(stderr);
        cb(err);
    });
});
