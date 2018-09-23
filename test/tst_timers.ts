import '../lib/timers';

export function test_setTimeout(test: any) {
    let fired = false;

    setTimeout(function () {
        fired = true;
    }, 20)

    test.wait(40);
    test.verify(fired);
}

export function test_setTimeoutArgs(test: any) {
    let fired = false;
    let argsMatched = false;
    const testArg1 = "foo";
    const testArg2 = 123;

    setTimeout(function (arg1, arg2) {
        fired = !fired;
        argsMatched = arg1 === testArg1 && arg2 === testArg2;
    }, 20, testArg1, testArg2)

    test.wait(60);
    test.verify(fired && argsMatched);
}

export function test_clearTimeout(test: any) {
    let fired = false;

    const id = setTimeout(function () {
        fired = !fired;
    }, 20);

    clearTimeout(id);

    test.wait(60);
    test.verify(!fired);
}

export function test_setInterval(test: any) {
    let count = 0;

    const id = setInterval(function () {
        count++;
        if (count === 3)
            clearInterval(id);
    }, 20)

    test.wait(100);
    test.verify(count === 3);
}

export function test_setIntervalArgs(test: any) {
    let count = 0;
    let argsMatched = false;
    const testArg1 = "foo";
    const testArg2 = 123;

    const id = setInterval(function (arg1, arg2) {
        count++;
        argsMatched = arg1 === testArg1 && arg2 === testArg2;
        if (count === 3)
            clearInterval(id);
    }, 20, testArg1, testArg2)

    test.wait(100);
    test.verify((count === 3) && argsMatched);
}

export function test_setTimeoutSimultaneous(test: any) {
    const maxTimeouts = 4;
    const timeouts: boolean[] = [];

    for (let i = 0; i < maxTimeouts; i++) {
        timeouts.push(false);
        (function (i) {
            setTimeout(function () {
                timeouts[i] = !timeouts[i];
            }, i * 20);
        }(i));
    }

    test.wait(100);

    for (let i = 0; i < maxTimeouts; i++) {
        test.verify(timeouts[i]);
    }
}

export function test_setIntervalSimultaneous(test: any) {
    const maxIntervals = 3;
    const intervals: number[] = [];

    for (let i = 0; i < maxIntervals; i++) {
        intervals.push(0);
        (function (i) {
            const id = setInterval(function () {
                if (intervals[i]++ === i)
                    clearInterval(id);
            }, 20);
        }(i));
    }

    test.wait(100);

    for (let i = 0; i < maxIntervals; i++) {
        test.verify(intervals[i] === i + 1);
    }
}
