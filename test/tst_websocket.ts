import '../lib/push/websocket';

export function test_WebSocket(test: any) {
    test.verify(typeof WebSocket === 'function');
    const ws = new WebSocket('ws://127.0.0.1:9091');
    test.verify(typeof ws === 'object');
    const msg = "Hello, World!";
    let msgReceived = false;
    ws.onmessage = function (e) {
        msgReceived = e.data === msg;
    };
    ws.onopen = function () {
        ws.send(msg);
    };
    test.wait(3000);
    test.verify(msgReceived);
}
