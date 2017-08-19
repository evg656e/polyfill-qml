import QtQuick 2.9
import QtTest 1.1
import "./build/tst_object.js" as Test

TestCase {
    id: test
    name: "TestObject"

    function test_setPrototypeOf() {
        Test.test_setPrototypeOf(test);
    }
}
