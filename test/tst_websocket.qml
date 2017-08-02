import QtQuick 2.9
import QtTest 1.1
import "./build/tst_websocket.js" as Test

TestCase {
    id: test
    name: "TestWebSocket"

    function test_WebSocket() {
        Test.test_WebSocket(test);
    }
}
