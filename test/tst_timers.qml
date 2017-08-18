import QtQuick 2.9
import QtTest 1.1
import "./build/tst_timers.js" as Test

TestCase {
    id: test
    name: "TestTimers"

    function test_setTimeout() {
        Test.test_setTimeout(test);
    }

    function test_setTimeoutArgs() {
        Test.test_setTimeoutArgs(test);
    }

    function test_clearTimeout() {
        Test.test_clearTimeout(test);
    }

    function test_setInterval() {
        Test.test_setInterval(test);
    }

    function test_setIntervalArgs() {
        Test.test_setIntervalArgs(test);
    }

    function test_setTimeoutSimultaneous() {
        Test.test_setTimeoutSimultaneous(test);
    }

    function test_setIntervalSimultaneous() {
        Test.test_setIntervalSimultaneous(test);
    }
}
