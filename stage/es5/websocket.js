var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter } from 'events';
var importWebsocketStatement = typeof QML_IMPORT_WEBSOCKET_STATEMENT === 'string' ? QML_IMPORT_WEBSOCKET_STATEMENT : 'import QtWebSockets 1.1';
var Event = /** @class */ (function () {
    function Event(type, target) {
        this.type = type;
        this.target = target;
    }
    return Event;
}());
var OpenEvent = /** @class */ (function (_super) {
    __extends(OpenEvent, _super);
    function OpenEvent(target) {
        return _super.call(this, 'open', target) || this;
    }
    return OpenEvent;
}(Event));
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(code, reason, target) {
        var _this = _super.call(this, 'close', target) || this;
        _this.code = code;
        _this.reason = reason;
        _this.wasClean = code === undefined || code === 1000;
        return _this;
    }
    return CloseEvent;
}(Event));
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(message, target) {
        var _this = _super.call(this, 'error', target) || this;
        _this.message = message;
        return _this;
    }
    return ErrorEvent;
}(Event));
var MessageEvent = /** @class */ (function (_super) {
    __extends(MessageEvent, _super);
    function MessageEvent(data, binary, target) {
        var _this = _super.call(this, 'message', target) || this;
        _this.data = data;
        _this.binary = binary;
        return _this;
    }
    return MessageEvent;
}(Event));
var WebSocket = /** @class */ (function (_super) {
    __extends(WebSocket, _super);
    function WebSocket(url) {
        var _this = _super.call(this) || this;
        _this.statusChanged = _this.statusChanged.bind(_this);
        _this.binaryMessageReceived = _this.binaryMessageReceived.bind(_this);
        _this.textMessageReceived = _this.textMessageReceived.bind(_this);
        _this.qtWebSocket = Qt.createQmlObject(importWebsocketStatement + "; WebSocket { url: '" + url + "' }", Qt.application); // url should be set inside qml object or socket won't work (qml bug?)
        _this.qtWebSocket.statusChanged.connect(_this.statusChanged);
        _this.qtWebSocket.binaryMessageReceived.connect(_this.binaryMessageReceived);
        _this.qtWebSocket.textMessageReceived.connect(_this.textMessageReceived);
        // this.qtWebSocket.url = url; // socket won't work (qt bug?)
        _this.qtWebSocket.active = true;
        return _this;
    }
    Object.defineProperty(WebSocket.prototype, "readyState", {
        get: function () {
            return this.qtWebSocket.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "url", {
        get: function () {
            return this.qtWebSocket.url.toString();
        },
        enumerable: true,
        configurable: true
    });
    WebSocket.prototype.dispatchEvent = function (event) {
        this.emit(event.type, event);
    };
    WebSocket.prototype.addEventListener = function (type, listener) {
        this.addListener(type, listener);
    };
    WebSocket.prototype.removeEventListener = function (type, listener) {
        this.removeListener(type, listener);
    };
    WebSocket.prototype.statusChanged = function (status) {
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
    };
    WebSocket.prototype.binaryMessageReceived = function (message) {
        this.dispatchEvent(new MessageEvent(message, true, this));
    };
    WebSocket.prototype.textMessageReceived = function (message) {
        this.dispatchEvent(new MessageEvent(message, false, this));
    };
    WebSocket.prototype.send = function (data) {
        if (Object.prototype.toString.call(data) === '[object ArrayBuffer]')
            this.qtWebSocket.sendBinaryMessage(data);
        else
            this.qtWebSocket.sendTextMessage(data);
    };
    WebSocket.prototype.close = function (code, reason) {
        this.code = code;
        this.reason = reason;
        this.qtWebSocket.active = false;
    };
    WebSocket.prototype.destroy = function () {
        var _this = this;
        this.qtWebSocket.active = false;
        Qt.callLater(function () {
            _this.removeAllListeners();
            _this.qtWebSocket.statusChanged.disconnect(_this.statusChanged);
            _this.qtWebSocket.binaryMessageReceived.disconnect(_this.binaryMessageReceived);
            _this.qtWebSocket.textMessageReceived.disconnect(_this.textMessageReceived);
            _this.qtWebSocket.destroy();
            delete _this.qtWebSocket;
        });
    };
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;
    WebSocket.ERROR = 4; // qt only
    return WebSocket;
}(EventEmitter));
export { WebSocket };
function shorthand(fn) {
    function wrapper(event) {
        fn.call(this, event);
    }
    wrapper.shorthand = true;
    return wrapper;
}
['open', 'error', 'close', 'message'].forEach(function (event) {
    Object.defineProperty(WebSocket.prototype, "on" + event, {
        get: function () {
            var listeners = this.listeners(event);
            for (var i = 0; i < listeners.length; i++)
                if (listeners[i].shorthand)
                    return listeners[i];
        },
        set: function (listener) {
            var listeners = this.listeners(event);
            for (var i = 0; i < listeners.length; i++)
                if (listeners[i].shorthand)
                    this.removeEventListener(event, listeners[i]);
            if (typeof listener === 'function')
                this.addEventListener(event, shorthand(listener));
        }
    });
});
