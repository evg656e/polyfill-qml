# polyfill-qml

Polyfill collection for QML JavaScript host environment.

Does not include polyfills from other libraries like [core-js](https://github.com/zloirock/core-js) (so feel free to add them if needed).

## Install

With npm:
```
npm install polyfill-qml --save-dev
```

## Usage

```javascript
// core qml polyfills (currently setTimeout/clearTimeout/etc, Object.setPrototypeOf, Function.prototype.toString fix)
require('polyfill-qml');
// or per library
var WebSocket = require('polyfill-qml/lib/websocket');
// combine with other polyfill libraries. e.g.
require('core-js/fn/array/find-index');
```
