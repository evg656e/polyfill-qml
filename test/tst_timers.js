require('../lib/timers.js');

module.exports = {
    test_setTimeout: function(test) {
        var fired = false;

        setTimeout(function() {
            fired = true;
        }, 10)

        test.wait(20);
        test.verify(fired);
    },

    test_setTimeoutArgs: function(test) {
        var fired = false;
        var argsMatched = false;
        var testArg1 = "foo";
        var testArg2 = 123;

        setTimeout(function(arg1, arg2) {
            fired = true;
            argsMatched = arg1 === testArg1 && arg2 === testArg2;
        }, 10, testArg1, testArg2)

        test.wait(20);
        test.verify(fired && argsMatched);
    },

    test_clearTimeout: function(test) {
        var fired = false;

        var id = setTimeout(function() {
            fired = true;
        }, 10);

        clearTimeout(id);

        test.wait(20);
        test.verify(!fired);
    },

    test_setInterval: function(test) {
        var count = 0;

        var id = setInterval(function() {
            count++;
            if (count == 3)
                clearInterval(id);
        }, 10)

        test.wait(50);
        test.verify(count == 3);
    },

    test_setIntervalArgs: function(test) {
        var count = 0;
        var argsMatched = false;
        var testArg1 = "foo";
        var testArg2 = 123;

        var id = setInterval(function(arg1, arg2) {
            count++;
            argsMatched = arg1 === testArg1 && arg2 === testArg2;
            if (count === 3)
                clearInterval(id);
        }, 10, testArg1, testArg2)

        test.wait(50);
        test.verify((count === 3) && argsMatched);
    }
};
