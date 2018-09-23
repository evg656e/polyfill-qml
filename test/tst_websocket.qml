import QtQuick 2.9
import QtTest 1.1
import QtWebSockets 1.1
import "./build/tst_websocket.js" as Test

TestCase {
    id: test
    name: "TestWebSocket"

    WebSocketServer {
        id: server
        host: '127.0.0.1'
        port: 9091
        listen: true
        onClientConnected: {
            webSocket.onTextMessageReceived.connect(function (message) {
                webSocket.sendTextMessage(message);
            });
        }
    }

    function test_WebSocket() {
        Test.test_WebSocket(test);
    }
}
