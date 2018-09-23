import { EventEmitter } from 'events';
const importWebsocketStatement = typeof QML_IMPORT_WEBSOCKET_STATEMENT === 'string' ? QML_IMPORT_WEBSOCKET_STATEMENT : 'import QtWebSockets 1.1';
class Event {
    constructor(type, target) {
        this.type = type;
        this.target = target;
    }
}
class OpenEvent extends Event {
    constructor(target) {
        super('open', target);
    }
}
class CloseEvent extends Event {
    constructor(code, reason, target) {
        super('close', target);
        this.code = code;
        this.reason = reason;
        this.wasClean = code === undefined || code === 1000;
    }
}
class ErrorEvent extends Event {
    constructor(message, target) {
        super('error', target);
        this.message = message;
    }
}
class MessageEvent extends Event {
    constructor(data, binary, target) {
        super('message', target);
        this.data = data;
        this.binary = binary;
    }
}
export class WebSocket extends EventEmitter {
    constructor(url) {
        super();
        this.statusChanged = this.statusChanged.bind(this);
        this.binaryMessageReceived = this.binaryMessageReceived.bind(this);
        this.textMessageReceived = this.textMessageReceived.bind(this);
        this.qtWebSocket = Qt.createQmlObject(`${importWebsocketStatement}; WebSocket { url: '${url}' }`, Qt.application); // url should be set inside qml object or socket won't work (qml bug?)
        this.qtWebSocket.statusChanged.connect(this.statusChanged);
        this.qtWebSocket.binaryMessageReceived.connect(this.binaryMessageReceived);
        this.qtWebSocket.textMessageReceived.connect(this.textMessageReceived);
        // this.qtWebSocket.url = url; // socket won't work (qt bug?)
        this.qtWebSocket.active = true;
    }
    get readyState() {
        return this.qtWebSocket.status;
    }
    get url() {
        return this.qtWebSocket.url.toString();
    }
    dispatchEvent(event) {
        this.emit(event.type, event);
    }
    addEventListener(type, listener) {
        this.addListener(type, listener);
    }
    removeEventListener(type, listener) {
        this.removeListener(type, listener);
    }
    statusChanged(status) {
        switch (status) {
            case WebSocket.CONNECTING: break;
            case WebSocket.OPEN:
                this.dispatchEvent(new OpenEvent(this));
                break;
            case WebSocket.CLOSING: break;
            case WebSocket.CLOSED:
                this.dispatchEvent(new CloseEvent(this.code, this.reason, this));
                this.destroy();
                break;
            case WebSocket.ERROR:
                this.dispatchEvent(new ErrorEvent(this.qtWebSocket.errorString, this));
                break;
            default: break;
        }
    }
    binaryMessageReceived(message) {
        this.dispatchEvent(new MessageEvent(message, true, this));
    }
    textMessageReceived(message) {
        this.dispatchEvent(new MessageEvent(message, false, this));
    }
    send(data) {
        if (Object.prototype.toString.call(data) === '[object ArrayBuffer]')
            this.qtWebSocket.sendBinaryMessage(data);
        else
            this.qtWebSocket.sendTextMessage(data);
    }
    close(code, reason) {
        this.code = code;
        this.reason = reason;
        this.qtWebSocket.active = false;
    }
    destroy() {
        this.qtWebSocket.active = false;
        Qt.callLater(() => {
            this.removeAllListeners();
            this.qtWebSocket.statusChanged.disconnect(this.statusChanged);
            this.qtWebSocket.binaryMessageReceived.disconnect(this.binaryMessageReceived);
            this.qtWebSocket.textMessageReceived.disconnect(this.textMessageReceived);
            this.qtWebSocket.destroy();
            delete this.qtWebSocket;
        });
    }
}
WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;
WebSocket.ERROR = 4; // qt only
function shorthand(fn) {
    function wrapper(event) {
        fn.call(this, event);
    }
    wrapper.shorthand = true;
    return wrapper;
}
['open', 'error', 'close', 'message'].forEach(function (event) {
    Object.defineProperty(WebSocket.prototype, `on${event}`, {
        get() {
            const listeners = this.listeners(event);
            for (let i = 0; i < listeners.length; i++)
                if (listeners[i].shorthand)
                    return listeners[i];
        },
        set(listener) {
            const listeners = this.listeners(event);
            for (let i = 0; i < listeners.length; i++)
                if (listeners[i].shorthand)
                    this.removeEventListener(event, listeners[i]);
            if (typeof listener === 'function')
                this.addEventListener(event, shorthand(listener));
        }
    });
});
