import { EventEmitter } from 'events';

declare const Qt: any;
declare const QML_IMPORT_WEBSOCKET_STATEMENT: string;

const importWebsocketStatement = typeof QML_IMPORT_WEBSOCKET_STATEMENT === 'string' ? QML_IMPORT_WEBSOCKET_STATEMENT : 'import QtWebSockets 1.1';

class Event {
    constructor(public type: string, public target: WebSocket) { }
}

class OpenEvent extends Event {
    constructor(target: WebSocket) {
        super('open', target);
    }
}

class CloseEvent extends Event {
    code: number | undefined;
    reason: string | undefined;
    wasClean: boolean;

    constructor(code: number | undefined, reason: string | undefined, target: WebSocket) {
        super('close', target);
        this.code = code;
        this.reason = reason;
        this.wasClean = code === undefined || code === 1000;
    }
}

class ErrorEvent extends Event {
    message: string;

    constructor(message: string, target: WebSocket) {
        super('error', target);
        this.message = message;
    }
}

class MessageEvent extends Event {
    data: any;
    binary: boolean;

    constructor(data: any, binary: boolean, target: WebSocket) {
        super('message', target);
        this.data = data;
        this.binary = binary;
    }
}

export class WebSocket extends EventEmitter {
    private code!: number | undefined;
    private reason!: string | undefined;
    private qtWebSocket: any;

    constructor(url: string) {
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
        return this.qtWebSocket.status as number;
    }

    get url() {
        return this.qtWebSocket.url.toString() as string;
    }

    dispatchEvent(event: Event) {
        this.emit(event.type, event);
    }

    addEventListener(type: string, listener: (e: Event) => void) {
        this.addListener(type, listener);
    }

    removeEventListener(type: string, listener: (e: Event) => void) {
        this.removeListener(type, listener);
    }

    statusChanged(status: number) {
        switch (status) {
            case WebSocket.CONNECTING: break;
            case WebSocket.OPEN: this.dispatchEvent(new OpenEvent(this)); break;
            case WebSocket.CLOSING: break;
            case WebSocket.CLOSED: this.dispatchEvent(new CloseEvent(this.code, this.reason, this)); this.destroy(); break;
            case WebSocket.ERROR: this.dispatchEvent(new ErrorEvent(this.qtWebSocket.errorString, this)); break;
            default: break;
        }
    }

    binaryMessageReceived(message: string) {
        this.dispatchEvent(new MessageEvent(message, true, this));
    }

    textMessageReceived(message: string) {
        this.dispatchEvent(new MessageEvent(message, false, this));
    }

    send(data: any) {
        if (Object.prototype.toString.call(data) === '[object ArrayBuffer]')
            this.qtWebSocket.sendBinaryMessage(data);
        else
            this.qtWebSocket.sendTextMessage(data);
    }

    close(code?: number, reason?: string) {
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

    'onopen': (event: OpenEvent) => void;
    'onerror': (event: ErrorEvent) => void;
    'onclose': (event: CloseEvent) => void;
    'onmessage': (event: MessageEvent) => void;

    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    static ERROR = 4; // qt only
}

interface Shorthand {
    shorthand: boolean;
    (event: Event): void;
}

function shorthand(fn: (event: Event) => any) {
    function wrapper(this: any, event: Event) {
        fn.call(this, event);
    }
    (<Shorthand>wrapper).shorthand = true;
    return wrapper;
}

['open', 'error', 'close', 'message'].forEach(function (event) {
    Object.defineProperty(WebSocket.prototype, `on${event}`, {
        get(this: WebSocket) {
            const listeners = this.listeners(event);
            for (let i = 0; i < listeners.length; i++)
                if ((<Shorthand>listeners[i]).shorthand)
                    return listeners[i];
        },
        set(this: WebSocket, listener: (event: Event) => void) {
            const listeners = this.listeners(event) as ((event: Event) => void)[];
            for (let i = 0; i < listeners.length; i++)
                if ((<Shorthand>listeners[i]).shorthand)
                    this.removeEventListener(event, listeners[i]);
            if (typeof listener === 'function')
                this.addEventListener(event, shorthand(listener));
        }
    });
});
