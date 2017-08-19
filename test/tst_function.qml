import QtQuick 2.9
import QtTest 1.1
import "./build/tst_function.js" as Test

TestCase {
    id: test
    name: "TestFunction"

    function test_funcToString() {
        Test.test_funcToString(test);
    }
}
