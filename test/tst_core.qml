import QtQuick 2.9
import QtTest 1.1
import "./build/tst_core.js" as Test

TestCase {
    id: test
    name: "TestCore"

    function test_funcToString() {
        Test.test_funcToString(test);
    }
}
