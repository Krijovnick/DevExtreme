"use strict";

var smartFormatter = require("viz/axes/smart_formatter").smartFormatter;

QUnit.module("numeric formatting");

QUnit.test("formatter should support short notations of numbers", function(assert) {
    assert.strictEqual(smartFormatter(102, 100), "102");
    assert.strictEqual(smartFormatter(1000, 100), "1K");
    assert.strictEqual(smartFormatter(1000000, 100000), "1M");
    assert.strictEqual(smartFormatter(1000000000, 100000000), "1B");
    assert.strictEqual(smartFormatter(1000000000000, 100000000000), "1T");
    assert.strictEqual(smartFormatter(1000000000000000, 100000000000000), "1E+15", "exponential");
});

QUnit.test("format numbers with non zero precision", function(assert) {
    assert.strictEqual(smartFormatter(1500, 100), "1.5K", "1500 -> 1.5K");
    assert.strictEqual(smartFormatter(150000, 1000), "150K", "1500 -> 1.5K");
    assert.strictEqual(smartFormatter(20000, 20000), "20K");
    assert.strictEqual(smartFormatter(2, 2), "2");
    assert.strictEqual(smartFormatter(160000, 20000), "160K");
});

QUnit.test("formatting numbers wtih multiplier of tickInterval === 2.5", function(assert) {
    assert.strictEqual(smartFormatter(1250, 250), "1.25K", "1250 -> 1.25K");
    assert.strictEqual(smartFormatter(160000, 250), "160K");
    assert.strictEqual(smartFormatter(30000, 2500), "30K");
    assert.strictEqual(smartFormatter(2500, 2500), "2.5K");
    assert.strictEqual(smartFormatter(8000, 250), "8K");
});

QUnit.test("index of tickInterval is not equal index of tick", function(assert) {
    assert.strictEqual(smartFormatter(1002, 2), "1,002", "1002 -> 1,002. TickInterval = 2");
});

QUnit.test("format negative values", function(assert) {
    assert.strictEqual(smartFormatter(-20, 10), "-20", "negative values");
});

QUnit.test("format zero value", function(assert) {
    assert.strictEqual(smartFormatter(0, 10), "0", "zero values");
});

QUnit.test("format values when index of tick above index of tickInterval", function(assert) {
    assert.strictEqual(smartFormatter(18, 2), "18");
});

QUnit.test("format float numbers", function(assert) {
    assert.strictEqual(smartFormatter(18.5, 0.5), "18.5");
    assert.strictEqual(smartFormatter(18, 0.5), "18", "formatting integer number with float tickInterval");
    assert.strictEqual(smartFormatter(18.25, 0.25), "18.25", "formatting values when tickInterval = 0.25");
});

QUnit.test("format float number. tickInterval = 2.5", function(assert) {
    assert.strictEqual(smartFormatter(18.5, 2.5), "18.5");
});

QUnit.test("Misc", function(assert) {
    assert.strictEqual(smartFormatter(10100, 100), "10.1K");
    assert.strictEqual(smartFormatter(10000000000000000000, 1000000000000000000), "1E+19");
});
