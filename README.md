# polyfill-qml

Minimal required polyfill library for QML JavaScript host environment.

## Install

With npm:
```
npm install polyfill-qml --save-dev
```

## Usage

```javascript
// core qml polyfills (setTimeout/clearTimeout/etc, Object.setPrototypeOf, Function.prototype.toString fix)
import 'polyfill-qml';

// or per library
import { WebSocket } from 'polyfill-qml/stage/es5/websocket';

// combine with other polyfill libraries, e.g.
import 'core-js/features/array/find-index';
```
