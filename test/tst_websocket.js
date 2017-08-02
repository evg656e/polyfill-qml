var WebSocket = require('../lib/websocket.js');

module.exports = {
    test_WebSocket: function(test) {
        verify(typeof WebSocket === 'function');
        var ws = new WebSocket('ws://127.0.0.1:8080');
        verify(typeof ws === 'object');
        var msg = "Hello, World!";
        var msgReceived = false;
        ws.onmessage = function(e) {
            msgReceived = e.data === msg;
        };
        ws.onopen = function() {
            ws.send(msg);
        };
        test.wait(1000);
        test.verify(msgReceived);
    },
};
