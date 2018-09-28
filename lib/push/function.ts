import { nativeToString, toString } from '../function';

if (!nativeToString.call(nativeToString).startsWith('function toString(')) {
    Object.defineProperty(Function.prototype, 'toString', {
        value(this: Function) {
            return toString(this);
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
}
