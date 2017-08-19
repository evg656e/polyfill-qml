require('../lib/function.js');

function foo() {
}

module.exports = {
    test_funcToString: function(test) {
        test.verify(foo.toString().startsWith('function foo('));
    }
};
