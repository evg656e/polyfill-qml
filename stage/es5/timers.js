"use strict";
/*!
    \brief Timers polyfill for QML.

    The resolution of timers will be at best 16ms.
    \see http://doc.qt.io/qt-5/qml-qtqml-timer.html
*/
var maxTimerCount = typeof QML_MAX_TIMER_COUNT === 'number' ? QML_MAX_TIMER_COUNT : 100;
var importTimerStatement = typeof QML_IMPORT_TIMER_STATEMENT === 'string' ? QML_IMPORT_TIMER_STATEMENT : 'import QtQml 2.2';
var timerPool = new Array(maxTimerCount);
var freeIndex = 0;
var timers = Object.create(null);
var callbacks = Object.create(null);
var uid = 0;
function createTimer() {
    if (freeIndex !== 0)
        return timerPool[--freeIndex];
    return Qt.createQmlObject(importTimerStatement + "; Timer {}", Qt.application);
}
function insertTimer(timer) {
    timers[++uid] = timer;
    return uid;
}
function removeTimer(timerId) {
    var timer = timers[timerId];
    var callback = callbacks[timerId];
    if (timer !== undefined) {
        delete timers[timerId];
        delete callbacks[timerId];
        timer.stop();
        timer.triggered.disconnect(callback);
        if (freeIndex < maxTimerCount)
            timerPool[freeIndex++] = timer;
        else
            timer.destroy();
    }
}
function setTimeout(callback, delay) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var timer = createTimer();
    var timerId = insertTimer(timer);
    function callbackWrapper() {
        removeTimer(timerId);
        callback.apply(void 0, args);
    }
    callbacks[timerId] = callbackWrapper;
    timer.interval = Math.max(delay, 1); // timer.interval should not be 0 (qt bug?)
    timer.triggered.connect(callbackWrapper);
    timer.start();
    return timerId;
}
function clearTimeout(timerId) {
    removeTimer(timerId);
}
function setInterval(callback, delay) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var timer = createTimer();
    var timerId = insertTimer(timer);
    function callbackWrapper() {
        callback.apply(void 0, args);
    }
    callbacks[timerId] = callbackWrapper;
    timer.interval = Math.max(delay, 1); // timer.interval should not be 0 (qt bug?)
    timer.triggered.connect(callbackWrapper);
    timer.repeat = true;
    timer.start();
    return timerId;
}
function clearInterval(timerId) {
    removeTimer(timerId);
}
global.setTimeout = setTimeout;
global.clearTimeout = clearTimeout;
global.setInterval = setInterval;
global.clearInterval = clearInterval;
