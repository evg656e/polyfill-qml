"use strict";
/*!
    \brief Timers polyfill for QML.

    The resolution of timers will be at best 16ms.
    \see http://doc.qt.io/qt-5/qml-qtqml-timer.html
*/
const maxTimerCount = typeof QML_MAX_TIMER_COUNT === 'number' ? QML_MAX_TIMER_COUNT : 100;
const importTimerStatement = typeof QML_IMPORT_TIMER_STATEMENT === 'string' ? QML_IMPORT_TIMER_STATEMENT : 'import QtQml 2.2';
const timerPool = new Array(maxTimerCount);
let freeIndex = 0;
const timers = Object.create(null);
const callbacks = Object.create(null);
let uid = 0;
function createTimer() {
    if (freeIndex !== 0)
        return timerPool[--freeIndex];
    return Qt.createQmlObject(`${importTimerStatement}; Timer {}`, Qt.application);
}
function insertTimer(timer) {
    timers[++uid] = timer;
    return uid;
}
function removeTimer(timerId) {
    const timer = timers[timerId];
    const callback = callbacks[timerId];
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
function setTimeout(callback, delay, ...args) {
    const timer = createTimer();
    const timerId = insertTimer(timer);
    function callbackWrapper() {
        removeTimer(timerId);
        callback(...args);
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
function setInterval(callback, delay, ...args) {
    const timer = createTimer();
    const timerId = insertTimer(timer);
    function callbackWrapper() {
        callback(...args);
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
