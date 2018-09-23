"use strict";
const nativeFuncToString = Function.prototype.toString;
if (!nativeFuncToString.call(nativeFuncToString).startsWith('function toString(')) {
    Object.defineProperty(Function.prototype, 'toString', {
        value() {
            let ret = nativeFuncToString.call(this);
            if (this.name !== undefined)
                ret = ret.slice(0, 8) + ' ' + this.name + ret.slice(8); // 8 === 'function'.length
            return ret;
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
}
