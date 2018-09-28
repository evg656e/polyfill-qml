import '../lib/push/function';

function foo() { }

export function test_funcToString(test: any) {
    test.verify(foo.toString().startsWith('function foo('));
}
