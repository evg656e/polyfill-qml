var funcToString = Function.prototype.toString;
if (!funcToString.call(funcToString).startsWith('function toString(')) {
    var funcLength = 'function'.length;
    Object.defineProperty(Function.prototype, 'toString', {
        value: function() {
            var ret = funcToString.call(this);
            if (this.name !== undefined)
                ret = ret.slice(0, funcLength) + ' ' + this.name + ret.slice(funcLength);
            return ret;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
}
