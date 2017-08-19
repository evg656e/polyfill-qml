const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const path = require('path');
const { exec, spawn } = require('child_process');

gulp.task('check-qmltestrunner', function (cb) {
    exec('qmltestrunner -help', function (err) {
        if (err) {
            console.error('qmltestrunner not found. To run tests add qmltestrunner to environment path first.');
            return cb(err);
        }
        cb();
    });
});

gulp.task('build-tests', function () {
    return gulp.src('test/tst_*.js')
        .pipe(named())
        .pipe(webpackStream({
            output: {
                libraryTarget: "umd"
            }
        }))
        .pipe(gulp.dest('test/build'));
});

gulp.task('test', ['check-qmltestrunner', 'build-tests'], function (cb) {
    const websocketServerPath = path.join(__dirname, './test/websocket-server/main.js');
    const websocketServer = spawn('node', [websocketServerPath]);
    websocketServer.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    websocketServer.stderr.on('data', (data) => {
        console.warn(data.toString());
        cb(data.toString());
    });
    websocketServer.on('exit', (code) => {
        console.log('Websocket server exited.');
    });

    exec('qmltestrunner -input test', function (err, stdout, stderr) {
        console.log(stdout);
        console.warn(stderr);
        cb(err);

        websocketServer.kill();
    });
});
