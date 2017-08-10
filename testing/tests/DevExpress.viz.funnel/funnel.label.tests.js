"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    labelModule = require("viz/series/points/label"),
    vizMocks = require("../../helpers/vizMocks.js"),
    createFunnel = common.createFunnel,
    environment = common.environment,
    stubAlgorithm = common.stubAlgorithm,
    Label = labelModule.Label,
    stubLabel = vizMocks.stubClass(Label),
    labels = require("viz/funnel/label");

var dxFunnel = require("viz/funnel/funnel");
dxFunnel.addPlugin(labels.plugin);

var labelEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.itemGroupNumber = 0;
        this.labelGroupNumber = 1;
        this.renderer.bBoxTemplate = { x: 0, y: 0, width: 0, height: 0 };
        this.renderer.bBoxTemplate = { width: 100 };

        stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);

        var labelBoxes = [
            {
                height: 10,
                width: 100
            }, {
                height: 10,
                width: 45
            }
            ],
            labelBoxesIndex = 0;

        sinon.stub(labelModule, "Label", function() {
            var stub = new stubLabel();
            stub.stub("getBoundingRect").returns(labelBoxes[(labelBoxesIndex++) % labelBoxes.length]);
            return stub;
        });

        $("#test-container").css({
            width: 800,
            height: 600
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        labelModule.Label.restore();
    },

    labelGroup: function() {
        return this.renderer.g.getCall(this.labelGroupNumber).returnValue;
    }
});

QUnit.module("Initialization", labelEnvironment);

QUnit.test("Create label group on initialization", function(assert) {
    createFunnel({});

    var labelsGroup = this.labelGroup();
    assert.equal(labelsGroup.append.lastCall.args[0], this.renderer.root);
    assert.equal(labelsGroup.attr.lastCall.args[0].className, "labels");
});

QUnit.test("Create labels", function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 2 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            font: {
                color: "red"
            },
            background: {
                dashStyle: "solid"
            },
            position: "outside",
            horizontalOffset: 0,
            verticalOffset: 0,
            showForZeroValues: false
        }
    });
    var labelsGroup = this.labelGroup(),
        label = labelModule.Label.getCall(0).returnValue;

    assert.ok(labelsGroup.clear.called);

    assert.equal(labelModule.Label.callCount, 2, "two labels are created");
    assert.equal(labelModule.Label.getCall(0).args[0].renderer, this.renderer);
    assert.equal(labelModule.Label.getCall(0).args[0].labelsGroup, labelsGroup);
    assert.ok(label.draw.calledOnce);

    assert.deepEqual(label.setData.lastCall.args[0], {
        value: 2
    }, "data");

    //TODO
    assert.deepEqual(label.setOptions.lastCall.args[0], {
        "argumentFormat": undefined,
        "attributes": {
            "font": {
                "color": "red"
            }
        },
        "background": {
            "dashStyle": "solid",
            "fill": "#5f8b95",
            "stroke": "none",
            "stroke-width": 0
        },
        "connector": {
            "stroke": "none",
            "stroke-width": 0
        },
        "customizeText": undefined,
        "format": undefined,
        "horizontalOffset": 0,
        "showForZeroValues": false,
        "verticalOffset": 0,
        "visible": true
    }, "options");
});

QUnit.test("Do not create labels if label.visible set to false", function(assert) {
    stubAlgorithm.getFigures.returns([[0], [0]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        valueField: "value",
        label: {
            visible: false
        }
    });
    var labelsGroup = this.labelGroup();

    assert.ok(labelsGroup.clear.called);
    assert.equal(labelModule.Label.callCount, 0, "no one label is created");
});

QUnit.test("Reserve space for labels if position outside", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 5, 685, 600]);
});

QUnit.test("Reserve space for labels if position outside and horizontal alignment is left", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [115, 5, 800, 600]);
});

QUnit.test("Reserve space for labels if position columns", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 5, 685, 600]);
});

QUnit.test("Do not reserve space for labels if position inside", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
});

QUnit.test("Relayout labels after dataSource changed", function(assert) {
    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    funnel.option({
        dataSource: [{ value: 2 }]
    });

    var items = this.items();
    assert.equal(items.length, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 5, 740, 600]);
});

QUnit.test("Place labels with outside position", function(assert) {
    this.renderer.bBoxTemplate = { width: 100 };

    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5],
        [0, 0.6, 1, 1]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [357.5, 332.5]);

    label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [700, 630]);
});

QUnit.test("Place labels with outside position and left horizontal alignment", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "Outside",
            horizontalAlignment: "left",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;

    assert.deepEqual(label.shift.args[0], [0, 35]);
});

QUnit.test("Place labels with inside position", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 175]);
});

QUnit.test("Place labels with inside position, figure is hexagon", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 1, 1, 0, 1, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "inside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue;
    assert.deepEqual(label.shift.args[0], [365, 325]);
});

QUnit.test("Place labels with columns position", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 35]);
    assert.deepEqual(label2.shift.args[0], [700, 35]);
});

QUnit.test("Place labels with columns position. rtl", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        rtlEnabled: true,
        label: {
            visible: true,
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [700, 35]);
    assert.deepEqual(label2.shift.args[0], [755, 35]);
});

QUnit.test("Place labels with columns position and left horizontal alignment", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            horizontalAlignment: "left",
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 35]);
    assert.deepEqual(label2.shift.args[0], [0, 35]);
});

QUnit.test("Place labels with columns position and left horizontal alignment. rtl", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5],
        [0, 0, 0.5, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        valueField: "value",
        rtlEnabled: true,
        label: {
            visible: true,
            horizontalAlignment: "left",
            position: "columns",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });
    var label1 = labelModule.Label.getCall(0).returnValue,
        label2 = labelModule.Label.getCall(1).returnValue;

    assert.deepEqual(label1.shift.args[0], [0, 35]);
    assert.deepEqual(label2.shift.args[0], [55, 35]);
});

QUnit.test("Connector strategy", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outsiDe",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    var label = labelModule.Label.getCall(0).returnValue,
        connectorStrategy = labelModule.Label.getCall(0).args[0].strategy,
        figure = label.setFigureToDrawConnector.lastCall.args[0];

    assert.deepEqual(connectorStrategy.getFigureCenter(figure), [685, 5], "center");
    assert.deepEqual(connectorStrategy.findFigurePoint(figure), [685, 5], "figure point");
    var points = [];
    assert.equal(connectorStrategy.prepareLabelPoints(points), points, "prepareLabelPoints");
    assert.equal(connectorStrategy.isLabelInside(), false, "isLabelInside");
});

QUnit.test("change label option", function(assert) {
    stubAlgorithm.getFigures.returns([
        [0, 0, 1, 0, 1, 0.5, 0, 0.5]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        valueField: "value",
        label: {
            visible: true,
            position: "outside",
            horizontalOffset: 15,
            verticalOffset: 30
        }
    });

    this.labelGroup().clear.reset();

    funnel.option({
        label: {
            position: "inside"
        }
    });

    assert.equal(this.labelGroup().clear.callCount, 1);
    assert.equal(labelModule.Label.callCount, 2);

    var label = labelModule.Label.getCall(1).returnValue;
    assert.deepEqual(label.shift.args[0], [392.5, 175]);
});

QUnit.module("Adaptive layout", $.extend({}, labelEnvironment, {
    beforeEach: function() {
        labelEnvironment.beforeEach.call(this);

        stubAlgorithm.getFigures.returns([
            [0, 0, 1, 1], [0, 0, 1, 1]
        ]);

        $("#test-container").css({
            width: 240
        });
    }
}));

QUnit.test("Hide labels", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: "outside"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 240, 600]);
    assert.ok(labelModule.Label.getCall(0).returnValue.hide.called);
    assert.ok(labelModule.Label.getCall(1).returnValue.hide.called);
    assert.ok(!labelModule.Label.getCall(0).returnValue.clearVisibility.called);
});

QUnit.test("Show hidden labels", function(assert) {
    var funnel = createFunnel({
            algorithm: "stub",
            dataSource: [{ value: 1 }, { value: 2 }],
            label: {
                visible: true,
                position: "outside"
            },
            adaptiveLayout: {
                width: 150,
                keepLabels: false
            }
        }),
        label = labelModule.Label.getCall(0).returnValue;

    label.hide.reset();

    funnel.option({
        size: {
            width: 400
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 5, 300, 600]);
    assert.ok(!label.hide.called);
    assert.ok(label.clearVisibility.called);
});

QUnit.test("Do not hide labels if keepLabels true", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: "outside"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 5, 150, 600]);
    assert.ok(!labelModule.Label.getCall(0).returnValue.hide.called);
    assert.ok(!labelModule.Label.getCall(1).returnValue.hide.called);
});

QUnit.test("Do not hide labels if keepLabels true. Container width less than adaptiveLayout", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 2 }],
        label: {
            visible: true,
            position: "outside"
        },
        adaptiveLayout: {
            width: 150,
            keepLabels: true
        },
        size: {
            width: 140
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 5, 140, 600]);
    assert.ok(!labelModule.Label.getCall(0).returnValue.hide.called);
    assert.ok(!labelModule.Label.getCall(1).returnValue.hide.called);
});

