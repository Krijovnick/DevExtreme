"use strict";

var tickGenerator = require("viz/axes/tick_generator").tickGenerator;

QUnit.module("Discrete", {});

QUnit.test("Return all categories", function(assert) {
    var generator = tickGenerator({
            dataType: "string",
            axisType: "discrete",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ categories: ["cat1", "cat2", "cat3", "cat4", "cat5"] }, 1000, undefined, undefined);

    assert.deepEqual(result.ticks, ["cat1", "cat2", "cat3", "cat4", "cat5"]);
});

QUnit.test("Do not calculate tickInterval if ratio of (categories count) to (count by spacingFactor) less than 4", function(assert) {
    var generator = tickGenerator({
            dataType: "string",
            axisType: "discrete",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        categories = new Array(79).fill(1),
        result;

    result = generator({ categories: categories }, 1000, undefined, undefined);

    assert.deepEqual(result.tickInterval, 1);
});

QUnit.test("Calculate tickInterval if ratio of (categories count) to (count by spacingFactor) more than 4", function(assert) {
    var generator = tickGenerator({
            dataType: "string",
            axisType: "discrete",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        categories = new Array(81).fill(1),
        result;

    result = generator({ categories: categories }, 1000, undefined, undefined);

    assert.deepEqual(result.tickInterval, 5);
});

QUnit.module("Numeric. Calculate tickInterval and ticks. allowDecimals false", {});

QUnit.test("0-10, screenDelta 200 - tickInterval 5", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: false,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 10 }, 200, undefined, undefined);

    assert.equal(result.tickInterval, 5);
});

QUnit.test("0-100, screenDelta 250 - tickInterval 20", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: false,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 100 }, 250, undefined, undefined);

    assert.equal(result.tickInterval, 20);
});

QUnit.test("0-100, screenDelta 200 - tickInterval 25", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: false,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 100 }, 200, undefined, undefined);

    assert.equal(result.tickInterval, 25);
});

QUnit.test("0-2, screenDelta 500 - tickInterval 1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: false,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 2 }, 500, undefined, undefined);

    assert.equal(result.tickInterval, 1);
});

QUnit.module("Numeric. Calculate tickInterval and ticks. allowDecimals true", {});

QUnit.test("0-10, screenDelta 200 - tickInterval 2.5", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 10 }, 200, undefined, undefined);

    assert.equal(result.tickInterval, 2.5);
});

QUnit.test("0-2, screenDelta 500 - tickInterval 0.2", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 2 }, 500, undefined, undefined);

    assert.equal(result.tickInterval, 0.2);
});

QUnit.test("0-2.1, screenDelta 5000 - tickInterval 0.025", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 2.1 }, 5000, undefined, undefined);

    assert.equal(result.tickInterval, 0.025);
});

QUnit.module("Numeric. forceTickInterval", {});

QUnit.test("forceTickInterval false. User's tickIntervsal 1, calculated tickInterval 2 - return calculated", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 10 }, 300, 1, false);

    assert.equal(result.tickInterval, 2);
});

QUnit.test("forceTickInterval true. User's tickIntervsal 1, calculated tickInterval 2 - return user tickInterval", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 10 }, 300, 1, true);

    assert.equal(result.tickInterval, 1);
});

QUnit.test("forceTickInterval true. No user's tickIntervsal, calculated tickInterval 2 - return calculated", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 10 }, 300, undefined, true);

    assert.equal(result.tickInterval, 2);
});

QUnit.module("Numeric. Misc", {});

QUnit.test("Without endOnTicks - calculate ticks inside data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0.5, max: 10.5 }, 1000, 1, undefined);

    assert.deepEqual(result.ticks, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(result.tickInterval, 1);
});

QUnit.test("Without endOnTicks - calculate ticks as multipliers of tickInterval", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 2, max: 11 }, 1000, 3, undefined);

    assert.deepEqual(result.ticks, [3, 6, 9]);
    assert.deepEqual(result.tickInterval, 3);
});

QUnit.test("With endOnTicks - calculate ticks outside or on data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: true,
            logBase: undefined
        }),
        result;

    result = generator({ min: 2, max: 12 }, 1000, 3, undefined);

    assert.deepEqual(result.ticks, [0, 3, 6, 9, 12]);
    assert.deepEqual(result.tickInterval, 3);
});

QUnit.test("allowDecimals is ignored with user tickInterval", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: false,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0.5, max: 10.5 }, 1000, 2.5, undefined);

    assert.deepEqual(result.ticks, [2.5, 5, 7.5, 10]);
    assert.deepEqual(result.tickInterval, 2.5);
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 20 }, 250, 2, true);

    assert.deepEqual(result.ticks, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    assert.deepEqual(result.tickInterval, 2);
});

QUnit.test("0-1. Screen delta is 500. Interval is 0.1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 1 }, 500, undefined, undefined);

    assert.equal(result.tickInterval, 0.1);
});

QUnit.test("0-20. Screen delta is 1000. Interval is 1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 20 }, 1000, undefined, undefined);

    assert.equal(result.tickInterval, 1);
});

QUnit.test("BusinessDelta is 0", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 200, max: 200 }, 1000, undefined, undefined);

    assert.deepEqual(result.ticks, [200]);
    assert.deepEqual(result.tickInterval, 1);
});

QUnit.test("Custom tickInterval is very small - ignore tickInterval and raise W2003 warning", function(assert) {
    var incidentOccurred = sinon.spy(),
        generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            incidentOccurred: incidentOccurred
        }),
        result;

    result = generator({ min: 0, max: 20 }, 199, 0.1, true);

    assert.equal(result.tickInterval, 10);
    assert.deepEqual(incidentOccurred.lastCall.args, ["W2003"]);
});

QUnit.test("tickInterval > businessDelta, no data as multiplier of tickInterval - take min as tick", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 13, max: 20 }, 200, 100, undefined);

    assert.deepEqual(result.ticks, [13]);
    assert.deepEqual(result.tickInterval, 100);
});

QUnit.test("tickInterval > businessDelta, there is data as multiplier of tickInterval - calculate tick", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 17.5, max: 24 }, 200, 20, undefined);

    assert.deepEqual(result.ticks, [20]);
    assert.deepEqual(result.tickInterval, 20);
});

QUnit.test("Custom numberMultipliers", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            numberMultipliers: [3, 4]
        }),
        result;

    result = generator({ min: 0, max: 20 }, 350, undefined, undefined);

    assert.deepEqual(result.ticks, [0, 3, 6, 9, 12, 15, 18]);
    assert.deepEqual(result.tickInterval, 3);
});

QUnit.test("Custom ticks", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 20 }, 200, undefined, undefined, { majors: [0, 6, 12, 18] });

    assert.deepEqual(result.ticks, [0, 6, 12, 18]);
    assert.deepEqual(result.tickInterval, 6);
});

QUnit.test("Custom one tick", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined
        }),
        result;

    result = generator({ min: 0, max: 20 }, 200, undefined, undefined, { majors: [5] });

    assert.deepEqual(result.ticks, [5]);
    assert.deepEqual(result.tickInterval, 0);
});

QUnit.test("customTicks with showCalculatedTicks", function(assert) { //DEPRECATED IN 15_2
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            showCalculatedTicks: true
        }),
        result;

    result = generator({ min: 0, max: 20 }, 200, undefined, undefined, { majors: [0.1, 0.2, 2.5] });

    assert.deepEqual(result.ticks, [0.1, 0.2, 2.5, 0, 5, 10, 15, 20]);
    assert.deepEqual(result.tickInterval, 5);
});

QUnit.test("showCalculatedTicks w/o customTicks", function(assert) { //DEPRECATED IN 15_2
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            showCalculatedTicks: true
        }),
        result;

    result = generator({ min: 0, max: 20 }, 200, undefined, undefined);

    assert.deepEqual(result.ticks, [0, 5, 10, 15, 20]);
    assert.deepEqual(result.tickInterval, 5);
});

QUnit.test("Tick values adjusting", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined
        }),
        result;

    result = generator({ min: 1.2398493489999, max: 9.3892384888888 }, 2500, undefined, undefined);

    assert.deepEqual(result.ticks, [1.4, 1.6, 1.8,
        2.0, 2.2, 2.4, 2.6, 2.8,
        3.0, 3.2, 3.4, 3.6, 3.8,
        4.0, 4.2, 4.4, 4.6, 4.8,
        5.0, 5.2, 5.4, 5.6, 5.8,
        6.0, 6.2, 6.4, 6.6, 6.8,
        7.0, 7.2, 7.4, 7.6, 7.8,
        8.0, 8.2, 8.4, 8.6, 8.8,
        9.0, 9.2]);
    assert.deepEqual(result.tickInterval, 0.2);
});

QUnit.test("Tick values adjusting on very small numbers", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            allowDecimals: true,
            endOnTicks: undefined
        }),
        result;

    result = generator({ min: 0, max: 0.0001 }, 800, undefined, undefined);

    assert.deepEqual(result.ticks, [0, 0.00001, 0.00002, 0.00003, 0.00004, 0.00005, 0.00006, 0.00007, 0.00008, 0.00009, 0.0001]);
    assert.deepEqual(result.tickInterval, 0.00001);
});

QUnit.module("Numeric. Minor ticks", {});

QUnit.test("tickInterval 5 - minorTickInterval 1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 10 }, 200, 5);

    assert.equal(result.minorTickInterval, 1);
    assert.deepEqual(result.minorTicks, [1, 2, 3, 4, 6, 7, 8, 9]);
});

QUnit.test("tickInterval 20 - minorTickInterval 5", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: false,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 100 }, 300, 20);

    assert.equal(result.minorTickInterval, 5);
    assert.deepEqual(result.minorTicks, [5, 10, 15, 25, 30, 35, 45, 50, 55, 65, 70, 75, 85, 90, 95]);
});

QUnit.test("Minor ticks do not go beyond bounds if endOnTicks = fasle", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: false,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 2.5, max: 12.3 }, 200, 5);

    assert.equal(result.minorTickInterval, 1);
    assert.deepEqual(result.minorTicks, [3, 4, 6, 7, 8, 9, 11, 12]);
});

QUnit.test("Minor ticks go beyond bounds if endOnTicks = true", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: true,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 4, max: 12.3 }, 170, 5);

    assert.equal(result.minorTickInterval, 1);
    assert.deepEqual(result.minorTicks, [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]);
});

QUnit.test("Minor ticks with given minorTickInterval", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 10 }, 200, 5, undefined, undefined, 2);

    assert.equal(result.minorTickInterval, 2);
    assert.deepEqual(result.minorTicks, [2, 4, 7, 9]);
});

QUnit.test("Minor ticks calculation can be suppressed", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: false
        }),
        result;

    result = generator({ min: 0, max: 10 }, 200, 5, undefined, undefined, 2);

    assert.equal(result.minorTickInterval, undefined);
    assert.deepEqual(result.minorTicks, []);
});

QUnit.test("Minor ticks with given minorTickCount", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 12 }, 200, 6, undefined, undefined, undefined, 3);

    assert.equal(result.minorTickInterval, 2);
    assert.deepEqual(result.minorTicks, [2, 4, 8, 10]);
});

QUnit.test("minorTickInterval has higher priority than minorTickCount", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 12 }, 200, 6, undefined, undefined, 1, 3);

    assert.equal(result.minorTickInterval, 1);
    assert.deepEqual(result.minorTicks, [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);
});

QUnit.test("Custom minorTicks", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 12 }, 200, undefined, undefined, { minors: [0.1, 0.2, 2.5] });

    assert.deepEqual(result.minorTicks, [0.1, 0.2, 2.5]);
    assert.deepEqual(result.minorTickInterval, 0.1);
});

QUnit.test("Custom minorTicks with showMinorCalculatedTicks", function(assert) { //DEPRECATED IN 15_2
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            showMinorCalculatedTicks: true,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 12 }, 100, undefined, undefined, { minors: [0.1, 0.2, 2.5] });

    assert.deepEqual(result.minorTicks, [0.1, 0.2, 2.5, 2, 4, 6, 8, 12]);
    assert.deepEqual(result.minorTickInterval, 2);
});

QUnit.test("showMinorCalculatedTicks w/o Custom minorTicks", function(assert) { //DEPRECATED IN 15_2
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            showMinorCalculatedTicks: true,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 12 }, 100, undefined, undefined, { });

    assert.deepEqual(result.minorTicks, [2, 4, 6, 8, 12]);
    assert.deepEqual(result.minorTickInterval, 2);
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 13, max: 40 }, 200, 100, undefined);

    assert.deepEqual(result.minorTicks, [23, 33]);
    assert.deepEqual(result.minorTickInterval, 10);

    assert.deepEqual(result.ticks, [13]);
    assert.deepEqual(result.tickInterval, 100);
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 17.5, max: 24 }, 150, 20, undefined);

    assert.deepEqual(result.minorTicks, [18, 22, 24]);
    assert.deepEqual(result.minorTickInterval, 2);
});

QUnit.test("Minor tick values adjusting on very small numbers", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0, max: 0.0001 }, 200, 0.0001);

    assert.equal(result.minorTickInterval, 0.00001);
    assert.deepEqual(result.minorTicks, [0.00001, 0.00002, 0.00003, 0.00004, 0.00005, 0.00006, 0.00007, 0.00008, 0.00009]);
});

QUnit.module("Logarithmic. Calculate tickInterval and ticks", {});

QUnit.test("0.0001 - 10000, screenDelta 450 - tickInterval 1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 10000 }, 450, undefined, undefined);

    assert.equal(result.tickInterval, 1);
});

QUnit.test("0.0001 - 10000, screenDelta 200 - tickInterval 2", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 10000 }, 200, undefined, undefined);

    assert.equal(result.tickInterval, 2);
});

QUnit.test("0.0001 - 10000, screenDelta 150 - tickInterval 3", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 10000 }, 150, undefined, undefined);

    assert.equal(result.tickInterval, 3);
});

QUnit.test("0.0001 - 10000, screenDelta 100 - tickInterval 5", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 10000 }, 100, undefined, undefined);

    assert.equal(result.tickInterval, 5);
});

QUnit.test("0.0001 - 100000, screenDelta 70 - tickInterval 10", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 100000 }, 70, undefined, undefined);

    assert.equal(result.tickInterval, 10);
});

QUnit.test("tickInterval can not be less than 1", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 1, max: 1000 }, 5000, undefined, undefined);

    assert.equal(result.tickInterval, 1);
});

QUnit.module("Logarithmic. Misc", {});

QUnit.test("Without endOnTicks - calculate ticks inside data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.00008, max: 11000 }, 450, 1, undefined);

    assert.deepEqual(result.ticks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000]);
    assert.deepEqual(result.tickInterval, 1);
});

QUnit.test("With endOnTicks - calculate ticks outside or on data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: true,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 9000 }, 450, 1, undefined);

    assert.deepEqual(result.ticks, [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000]);
    assert.deepEqual(result.tickInterval, 1);
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: false,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0001, max: 10000 }, 150, 2, true);

    assert.deepEqual(result.ticks, [0.0001, 0.01, 1, 100, 10000]);
    assert.deepEqual(result.tickInterval, 2);
});

QUnit.test("logBase 2", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 2
        }),
        result;

    result = generator({ min: 1.74, max: 1100 }, 300, undefined, undefined);

    assert.deepEqual(result.ticks, [4, 16, 64, 256, 1024]);
    assert.deepEqual(result.tickInterval, 2);
});

QUnit.test("min = 0, max = 0", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0, max: 0 }, 300, undefined, undefined);

    assert.deepEqual(result.ticks, []);
    assert.deepEqual(result.tickInterval, 0);
});

QUnit.test("customTicks", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 1, max: 1000 }, 300, undefined, undefined, { majors: [1, 100, 10000] });

    assert.deepEqual(result.ticks, [1, 100, 10000]);
    assert.deepEqual(result.tickInterval, 2);
});

QUnit.test("Tick values adjusting on very small numbers", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            logBase: 10
        }),
        result;

    result = generator({ min: 0.0000001, max: 1 }, 500, undefined, undefined);

    assert.deepEqual(result.ticks, [0.0000001, 0.000001, 0.00001, 0.0001, 0.001, 0.01, 0.1, 1]);
    assert.deepEqual(result.tickInterval, 1);
});

QUnit.module("Logarithmic. Minor ticks", {});

QUnit.test("minorTickInterval as exponent, but ticks not", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            endOnTicks: undefined,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 1, max: 100 }, 150, undefined, undefined);

    assert.equal(result.minorTickInterval, 0.2);
    assert.deepEqual(result.minorTicks, [2, 4, 6, 8, 20, 40, 60, 80]);
});

QUnit.test("Minor ticks do not go beyond bounds if endOnTicks = fasle", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: false,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 5, max: 300 }, 150, 1);

    assert.equal(result.minorTickInterval, 0.2);
    assert.deepEqual(result.minorTicks, [6, 8, 20, 40, 60, 80, 200]);
});

QUnit.test("Minor ticks go beyond bounds if endOnTicks = true", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: true,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 5, max: 300 }, 150, 1);

    assert.equal(result.minorTickInterval, 0.2);
    assert.deepEqual(result.minorTicks, [2, 4, 6, 8, 20, 40, 60, 80, 200, 400, 600, 800]);
});

QUnit.test("Minor ticks with given minorTickInterval", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: undefined,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 1, max: 100 }, 150, 1, undefined, undefined, 0.25);

    assert.equal(result.minorTickInterval, 0.25);
    assert.deepEqual(result.minorTicks, [2.5, 5, 7.5, 25, 50, 75]);
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 26, max: 99 }, 60, undefined, undefined);

    assert.deepEqual(result.minorTicks, [50, 75]);
    assert.deepEqual(result.minorTickInterval, 0.25);
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: true,
            endOnTicks: undefined,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 50, max: 250 }, 75, undefined, undefined);

    assert.deepEqual(result.minorTicks, [60, 80, 200]);
    assert.deepEqual(result.minorTickInterval, 0.2);
});

QUnit.test("Minor tick values adjusting on very small numbers", function(assert) {
    var generator = tickGenerator({
            dataType: "numeric",
            axisType: "logarithmic",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            allowDecimals: undefined,
            endOnTicks: true,
            logBase: 10,
            calculateMinors: true
        }),
        result;

    result = generator({ min: 0.000001, max: 0.00001 }, 75, 1);

    assert.equal(result.minorTickInterval, 0.2);
    assert.deepEqual(result.minorTicks, [0.000002, 0.000004, 0.000006, 0.000008]);
});

QUnit.module("DateTime. Calculate tickInterval and ticks", {});

QUnit.test("Milliseconds tickInterval (5ms)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 12, 3, 5, 123), max: new Date(2012, 3, 1, 12, 3, 5, 149) }, 300, undefined, undefined);

    assert.deepEqual(result.ticks.map(function(d) { return d.getTime(); }), [new Date(2012, 3, 1, 12, 3, 5, 125),
        new Date(2012, 3, 1, 12, 3, 5, 130),
        new Date(2012, 3, 1, 12, 3, 5, 135),
        new Date(2012, 3, 1, 12, 3, 5, 140),
        new Date(2012, 3, 1, 12, 3, 5, 145)].map(function(d) { return d.getTime(); }));
    assert.deepEqual(result.tickInterval, { "milliseconds": 5 });
});

QUnit.test("Seconds tickInterval (5s)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 12, 3, 3), max: new Date(2012, 3, 1, 12, 3, 26) }, 300, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 1, 12, 3, 5),
        new Date(2012, 3, 1, 12, 3, 10),
        new Date(2012, 3, 1, 12, 3, 15),
        new Date(2012, 3, 1, 12, 3, 20),
        new Date(2012, 3, 1, 12, 3, 25)]);
    assert.deepEqual(result.tickInterval, { "seconds": 5 });
});

QUnit.test("Minutes tickInterval (3)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 12, 1), max: new Date(2012, 3, 1, 12, 16) }, 300, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 1, 12, 3),
        new Date(2012, 3, 1, 12, 6),
        new Date(2012, 3, 1, 12, 9),
        new Date(2012, 3, 1, 12, 12),
        new Date(2012, 3, 1, 12, 15)]);
    assert.deepEqual(result.tickInterval, { "minutes": 3 });
});

QUnit.test("Hours tickInterval (4)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 3), max: new Date(2012, 3, 1, 21) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 1, 4),
        new Date(2012, 3, 1, 8),
        new Date(2012, 3, 1, 12),
        new Date(2012, 3, 1, 16),
        new Date(2012, 3, 1, 20)]);
    assert.deepEqual(result.tickInterval, { "hours": 4 });
});

QUnit.test("Days tickInterval (2)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 2, 13), max: new Date(2012, 3, 11, 5) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 4),
        new Date(2012, 3, 6),
        new Date(2012, 3, 8),
        new Date(2012, 3, 10)]);
    assert.deepEqual(result.tickInterval, { "days": 2 });
});

QUnit.test("Weeks tickInterval (2)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 2, 30), max: new Date(2012, 4, 30) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 8),
        new Date(2012, 3, 22),
        new Date(2012, 4, 6),
        new Date(2012, 4, 20)]);
    assert.deepEqual(result.tickInterval, { "weeks": 2 });
});

QUnit.test("Months tickInterval (3)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2011, 10, 20), max: new Date(2013, 0, 15) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 0, 1),
        new Date(2012, 3, 1),
        new Date(2012, 6, 1),
        new Date(2012, 9, 1),
        new Date(2013, 0, 1)]);
    assert.deepEqual(result.tickInterval, { "months": 3 });
});

QUnit.test("Years tickInterval (2)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2005, 0, 1), max: new Date(2013, 0, 1) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(2006, 0, 1),
        new Date(2008, 0, 1),
        new Date(2010, 0, 1),
        new Date(2012, 0, 1)]);
    assert.deepEqual(result.tickInterval, { "years": 2 });
});

QUnit.test("Years tickInterval can not be 2.5 (5)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(1994, 11, 20), max: new Date(2015, 5, 1) }, 500, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(1995, 0, 1),
        new Date(2000, 0, 1),
        new Date(2005, 0, 1),
        new Date(2010, 0, 1),
        new Date(2015, 0, 1)]);
    assert.deepEqual(result.tickInterval, { "years": 5 });
});

QUnit.test("Years tickInterval (25)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(1899, 0, 1), max: new Date(2001, 0, 1) }, 250, undefined, undefined);

    assert.deepEqual(result.ticks, [new Date(1900, 0, 1),
        new Date(1925, 0, 1),
        new Date(1950, 0, 1),
        new Date(1975, 0, 1),
        new Date(2000, 0, 1)]);
    assert.deepEqual(result.tickInterval, { "years": 25 });
});

QUnit.module("DateTime. Misc", {});

QUnit.test("Without endOnTicks - calculate ticks inside data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: undefined
        }),
        result;

    result = generator({ min: new Date(2017, 1, 3, 13, 28, 33), max: new Date(2017, 1, 12, 5, 3) }, 300, { "days": 2 }, undefined);

    assert.deepEqual(result.ticks, [new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11)]);
    assert.deepEqual(result.tickInterval, { "days": 2 });
});

QUnit.test("With endOnTicks - calculate ticks outside or on data bounds", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: true
        }),
        result;

    result = generator({ min: new Date(2017, 1, 3, 13, 28, 33), max: new Date(2017, 1, 11, 5, 3) }, 300, { "days": 2 }, undefined);

    assert.deepEqual(result.ticks, [new Date(2017, 1, 3),
        new Date(2017, 1, 5),
        new Date(2017, 1, 7),
        new Date(2017, 1, 9),
        new Date(2017, 1, 11),
        new Date(2017, 1, 13)]);
    assert.deepEqual(result.tickInterval, { "days": 2 });
});

QUnit.test("Force user tick interval if it is too small for given screenDelta and spacing factor", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: undefined
        }),
        result;

    result = generator({ min: new Date(2017, 1, 4, 13, 28, 33), max: new Date(2017, 1, 8, 5, 3) }, 150, { "days": 1 }, true);

    assert.deepEqual(result.ticks, [new Date(2017, 1, 5), new Date(2017, 1, 6), new Date(2017, 1, 7), new Date(2017, 1, 8)]);
    assert.deepEqual(result.tickInterval, { "days": 1 });
});

QUnit.test("Quarters custom interval", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: undefined
        }),
        result;

    result = generator({ min: new Date(2011, 0, 10), max: new Date(2011, 10, 1) }, 300, { "quarters": 1 }, undefined);

    assert.deepEqual(result.ticks, [new Date(2011, 3, 1),
        new Date(2011, 6, 1),
        new Date(2011, 9, 1)]);
    assert.deepEqual(result.tickInterval, { "quarters": 1 });
});

QUnit.test("Custom tickInterval with several keys - use bigger key as multiplier", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: false
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 11, 3, 3), max: new Date(2012, 3, 1, 21) }, 250, { hours: 2, seconds: 30 }, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 1, 12, 0, 30),
        new Date(2012, 3, 1, 14, 1, 0),
        new Date(2012, 3, 1, 16, 1, 30),
        new Date(2012, 3, 1, 18, 2, 0),
        new Date(2012, 3, 1, 20, 2, 30)]);
    assert.deepEqual(result.tickInterval, { hours: 2, seconds: 30 });
});

QUnit.test("Custom tickInterval with several keys - use bigger key as multiplier", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: true
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1, 11, 3, 3), max: new Date(2012, 3, 1, 21) }, 250, { hours: 2, seconds: 30 }, undefined);

    assert.deepEqual(result.ticks, [new Date(2012, 3, 1, 10, 0, 0),
        new Date(2012, 3, 1, 12, 0, 30),
        new Date(2012, 3, 1, 14, 1, 0),
        new Date(2012, 3, 1, 16, 1, 30),
        new Date(2012, 3, 1, 18, 2, 0),
        new Date(2012, 3, 1, 20, 2, 30),
        new Date(2012, 3, 1, 22, 3, 0)]);
    assert.deepEqual(result.tickInterval, { hours: 2, seconds: 30 });
});

QUnit.test("customTicks", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: true
        }),
        result;

    result = generator({ min: new Date(2011, 3, 10), max: new Date(2011, 6, 10) }, 250, { hours: 2, seconds: 30 }, undefined,
        { majors: [new Date(2011, 3, 10), new Date(2011, 4, 10), new Date(2011, 5, 10), new Date(2011, 6, 10)] });

    assert.deepEqual(result.ticks, [new Date(2011, 3, 10),
        new Date(2011, 4, 10),
        new Date(2011, 5, 10),
        new Date(2011, 6, 10)]);
    assert.deepEqual(result.tickInterval, { months: 1 });
});

QUnit.test("Custom tickInterval is very small - ignore tickInterval and raise W2003 warning", function(assert) {
    var incidentOccurred = sinon.spy(),
        generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            endOnTicks: undefined,
            incidentOccurred: incidentOccurred
        }),
        result;

    result = generator({ min: new Date(2012, 3, 2, 2), max: new Date(2012, 3, 12, 12) }, 249, { hours: 1 }, undefined);

    assert.deepEqual(result.tickInterval, { weeks: 1 });
    assert.deepEqual(incidentOccurred.lastCall.args, ["W2003"]);
});

QUnit.module("DateTime. Minor ticks", {});

QUnit.test("tickInterval month - minorTickInterval can not be in weeks", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1), max: new Date(2012, 5, 1) }, 120, { months: 1 });

    assert.deepEqual(result.minorTickInterval, { days: 14 });
    assert.deepEqual(result.minorTicks, [ new Date(2012, 3, 15), new Date(2012, 3, 29), new Date(2012, 4, 15), new Date(2012, 4, 29) ]);
});

QUnit.test("Custom minorTicks", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: new Date(2012, 3, 1), max: new Date(2012, 5, 1) }, 120, { months: 1 }, undefined, {
        minors: [new Date(2012, 3, 10), new Date(2012, 3, 20), new Date(2012, 3, 30), new Date(2012, 4, 9)]
    });

    assert.deepEqual(result.minorTicks, [new Date(2012, 3, 10), new Date(2012, 3, 20), new Date(2012, 3, 30), new Date(2012, 4, 9)]);
    assert.deepEqual(result.minorTickInterval, { days: 10 });
});

QUnit.test("Minor ticks when there is only one major tick on min (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: new Date(2012, 3, 10), max: new Date(2012, 3, 30) }, 75, { months: 1 }, undefined);

    assert.deepEqual(result.minorTicks, [new Date(2012, 3, 17), new Date(2012, 3, 24)]);
    assert.deepEqual(result.minorTickInterval, { days: 7 });
});

QUnit.test("Minor ticks when there is only one major tick in the middle (big tickInterval)", function(assert) {
    var generator = tickGenerator({
            dataType: "datetime",
            axisType: "continuous",
            gridSpacingFactor: 50,
            minorGridSpacingFactor: 15,
            endOnTicks: undefined,
            calculateMinors: true
        }),
        result;

    result = generator({ min: new Date(2012, 2, 20), max: new Date(2012, 3, 9) }, 75, { months: 1 }, undefined);

    assert.deepEqual(result.minorTicks, [new Date(2012, 2, 20), new Date(2012, 2, 27), new Date(2012, 3, 8)]);
    assert.deepEqual(result.minorTickInterval, { days: 7 });
});
