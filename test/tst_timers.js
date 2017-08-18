require('../lib/timers.js');

module.exports = {
    test_setTimeout: function(test) {
        var fired = false;

        setTimeout(function() {
            fired = true;
        }, 20)

        test.wait(40);
        test.verify(fired);
    },

    test_setTimeoutArgs: function(test) {
        var fired = false;
        var argsMatched = false;
        var testArg1 = "foo";
        var testArg2 = 123;

        setTimeout(function(arg1, arg2) {
            fired = !fired;
            argsMatched = arg1 === testArg1 && arg2 === testArg2;
        }, 20, testArg1, testArg2)

        test.wait(60);
        test.verify(fired && argsMatched);
    },

    test_clearTimeout: function(test) {
        var fired = false;

        var id = setTimeout(function() {
            fired = !fired;
        }, 20);

        clearTimeout(id);

        test.wait(60);
        test.verify(!fired);
    },

    test_setInterval: function(test) {
        var count = 0;

        var id = setInterval(function() {
            count++;
            if (count === 3)
                clearInterval(id);
        }, 20)

        test.wait(100);
        test.verify(count === 3);
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
        }, 20, testArg1, testArg2)

        test.wait(100);
        test.verify((count === 3) && argsMatched);
    },

    test_setTimeoutSimultaneous: function(test) {
        var maxTimeouts = 4;
        var timeouts = [];

        for (var i = 0; i < maxTimeouts; i++) {
            timeouts.push(false);
            (function(i) {
                setTimeout(function() {
                    timeouts[i] = !timeouts[i];
                }, i*20);
            }(i));
        }

        test.wait(100);

        for (var i = 0; i < maxTimeouts; i++) {
            test.verify(timeouts[i]);
        }
    },

    test_setIntervalSimultaneous: function(test) {
        var maxIntervals = 3;
        var intervals = [];

        for (var i = 0; i < maxIntervals; i++) {
            intervals.push(0);
            (function(i) {
                var id = setInterval(function() {
                    if (intervals[i]++ === i)
                        clearInterval(id);
                }, 20);
            }(i));
        }

        test.wait(100);

        for (var i = 0; i < maxIntervals; i++) {
            test.verify(intervals[i] === i + 1);
        }
    }
};
