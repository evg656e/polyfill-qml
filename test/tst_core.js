require('../lib/core.js');

function foo() {
    return 0;
}

module.exports = {
    test_funcToString: function(test) {
        var funcStr = foo.toString();
        test.verify(funcStr.startsWith('function foo('));
    }
};
