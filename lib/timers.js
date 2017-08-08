/*!
    The Timer type is synchronized with the animation timer.
    Since the animation timer is usually set to 60fps, the resolution of Timer will be at best 16ms.
    \see http://doc.qt.io/qt-5/qml-qtqml-timer.html
*/
var timers = {};
var currentId = 0;

function createTimer() {
    return Qt.createQmlObject('import QtQml 2.2; Timer {}', Qt.application);
}

function insertTimer(timer) {
    timers[++currentId] = timer;
    return currentId;
}

function removeTimer(timerId) {
    var timer = timers[timerId];
    if (timer) {
        delete timers[timerId];
        timer.stop();
        timer.destroy();
    }
}

function setTimeout(callback, delay) {
    var timer   = createTimer(),
        timerId = insertTimer(timer),
        args    = Array.prototype.slice.call(arguments, 2);
    timer.interval = delay || 1; // timer.interval should not be 0 (qt bug?)
    timer.triggered.connect(function() {
        removeTimer(timerId);
        callback.apply(this, args);
    }.bind(this));
    timer.start();
    return timerId;
}

function clearTimeout(timerId) {
    removeTimer(timerId);
}

function setInterval(callback, delay) {
    var timer   = createTimer(),
        timerId = insertTimer(timer),
        args    = Array.prototype.slice.call(arguments, 2);
    timer.interval = delay || 1; // timer.interval should not be 0 (qt bug?)
    timer.repeat = true;
    timer.triggered.connect(function() {
        callback.apply(this, args);
    }.bind(this));
    timer.start();
    return timerId;
}

function clearInterval(timerId) {
    removeTimer(timerId);
}

global.setTimeout    = setTimeout;
global.clearTimeout  = clearTimeout;
global.setInterval   = setInterval;
global.clearInterval = clearInterval;
