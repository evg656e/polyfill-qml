var funcToString = Function.prototype.toString;
if (!funcToString.call(function test() {}).startsWith('function test(')) {
    Function.prototype.toString = function() {
        var ret = funcToString.call(this);
        if (this.name !== undefined)
            ret = ret.slice(0, 8) + ' ' + this.name + ret.slice(8); // 8 === 'function'.length
        return ret;
    };
}
