"use strict";

var labelModule = require("../series/points/label"),
    _normalizeEnum = require("../core/utils").normalizeEnum,
    extend = require("../../core/utils/extend").extend,
    OUTSIDE_POSITION = "outside",
    COLUMNS_POSITION = "columns";


function isOutsidePosition(pos) {
    pos = _normalizeEnum(pos);
    return pos === OUTSIDE_POSITION || pos === COLUMNS_POSITION;
}

function getOutsideRightLabelPosition(item, bBox, options) {
    return {
        x: item.coords[2] + options.horizontalOffset,
        y: item.coords[3] - bBox.height / 2 + options.verticalOffset
    };
}

function getOutsideLeftLabelPosition(item, bBox, options) {
    return {
        x: item.coords[0] - bBox.width - options.horizontalOffset,
        y: item.coords[1] - bBox.height / 2 + options.verticalOffset
    };
}

function getInsideLabelPosition(item, bBox, options) {
    var width = item.coords[2] - item.coords[0],
        height = item.coords[7] - item.coords[1];

    return {
        x: item.coords[0] + width / 2 + options.horizontalOffset - bBox.width / 2,
        y: item.coords[1] + options.verticalOffset + height / 2 - bBox.height / 2
    };
}

function getColumnLabelRightPosition(x, maxWidth) {
    return function(item, bBox, options) {
        return {
            x: x + maxWidth - bBox.width + options.horizontalOffset,
            y: item.coords[3] - bBox.height / 2 + options.verticalOffset
        };
    };
}

function getColumnLabelLeftPosition(x, maxWidth) {
    return function(item, bBox, options) {
        return {
            x: x - maxWidth - options.horizontalOffset,
            y: item.coords[3] - bBox.height / 2 + options.verticalOffset
        };
    };
}

function getFigureCenter(figure) {
    return [figure[2], figure[3]];
}

function getConnectorStrategy(options) {
    return {
        isLabelInside: function() {
            return !isOutsidePosition(options.position);
        },
        getFigureCenter: getFigureCenter,
        prepareLabelPoints: function(points) {
            return points;
        },

        findFigurePoint: function(figure) {
            return getFigureCenter(figure);
        }
    };
}

function getLabelOptions(labelOptions, defaultColor) {
    var opt = labelOptions || {},
        labelFont = extend({}, opt.font) || {},
        labelBorder = opt.border || {},
        labelConnector = opt.connector || {},
        backgroundAttr = {
            fill: opt.backgroundColor || defaultColor,
            "stroke-width": labelBorder.visible ? labelBorder.width || 0 : 0,
            stroke: labelBorder.visible && labelBorder.width ? labelBorder.color : "none",
            dashStyle: labelBorder.dashStyle
        },
        connectorAttr = {
            stroke: labelConnector.visible && labelConnector.width ? labelConnector.color || defaultColor : "none",
            "stroke-width": labelConnector.visible ? labelConnector.width || 0 : 0
        };

    labelFont.color = (opt.backgroundColor === "none" && _normalizeEnum(labelFont.color) === "#ffffff" && opt.position !== "inside") ? defaultColor : labelFont.color;

    return {
        format: opt.format,
        argumentFormat: opt.argumentFormat,
        customizeText: opt.customizeText,
        attributes: { font: labelFont },
        visible: labelFont.size !== 0 ? opt.visible : false,
        showForZeroValues: opt.showForZeroValues,
        horizontalOffset: opt.horizontalOffset,
        verticalOffset: opt.verticalOffset,
        background: backgroundAttr,
        connector: connectorAttr,
    };
}

exports.plugin = {
    name: "lables",
    init: function() {

    },
    dispose: function() {

    },
    extenders: {
        _initCore: function() {
            this._labelsGroup = this._renderer.g().attr({
                className: "labels"
            }).append(this._renderer.root);
            this._labels = [];
        },

        _applySize: function() {
            var options = this._getOption("label"),
                adaptiveLayout = this._getOption("adaptiveLayout"),
                rect = this._rect,
                labelHeight = 0,
                labelWidth = 0,
                groupWidth,
                width = rect[2] - rect[0];

            if(!this._labels.length || !isOutsidePosition(options.position)) {
                return;
            }

            groupWidth = this._labels.map(function(label) {
                return label.getBoundingRect().width;
            }).reduce(function(max, width) {
                return Math.max(max, width);
            }, 0);

            labelHeight = this._labels[0].getBoundingRect().height / 2;
            labelWidth = groupWidth + options.horizontalOffset;

            if(!adaptiveLayout.keepLabels && width - labelWidth < adaptiveLayout.width) {
                this._labels.forEach(function(label) {
                    label.hide();
                });
                return;
            } else {
                if(width - labelWidth < adaptiveLayout.width) {
                    labelWidth = width - adaptiveLayout.width;
                    labelWidth = labelWidth > 0 ? labelWidth : 0;
                }
                this._labels.forEach(function(label) {
                    label.clearVisibility();
                });
            }

            if(options.horizontalAlignment === "left") {
                rect[0] += labelWidth;
            } else {
                rect[2] -= labelWidth;
            }

            rect[1] += labelHeight;
        },

        _buildNodes: function() {
            this._createLabels();
        },

        _change_TILING: function() {
            var that = this,
                options = this._getOption("label"),
                bBoxes = that._labels.map(function(label) {
                    return label.getBoundingRect();
                }),
                getCoords = getInsideLabelPosition,
                maxWidth;

            if(isOutsidePosition(options.position)) {
                getCoords = options.horizontalAlignment === "left" ? getOutsideLeftLabelPosition : getOutsideRightLabelPosition;
            }

            if(_normalizeEnum(options.position) === COLUMNS_POSITION) {
                maxWidth = bBoxes.reduce(function(max, bBox) {
                    return Math.max(max, bBox.width);
                }, 0);
                getCoords = options.horizontalAlignment === "left" ? getColumnLabelLeftPosition(this._rect[0], maxWidth) : getColumnLabelRightPosition(this._rect[2], maxWidth);
            }

            that._labels.forEach(function(label, index) {
                var bBox = bBoxes[index],
                    item = that._items[index],
                    pos = getCoords(item, bBox, options);

                label.setFigureToDrawConnector(item.coords);
                label.shift(pos.x, pos.y);
            });
        }
    },
    members: {
        _createLabels: function() {
            var that = this,
                labelOptions = that._getOption("label"),
                connectorStrategy = getConnectorStrategy(labelOptions);

            this._labelsGroup.clear();

            if(!labelOptions.visible) {
                return;
            }

            this._labels = that._items.map(function(item) {
                var label = new labelModule.Label({
                    renderer: that._renderer,
                    labelsGroup: that._labelsGroup,
                    strategy: connectorStrategy
                });

                label.setOptions(getLabelOptions(labelOptions, item.color)); //TODO process options

                label.setData({
                    value: item.data.value
                });

                label.draw();

                return label;
            });

            if(this._labels.length && isOutsidePosition(labelOptions.position)) {
                this._requestChange(["LAYOUT"]);
            }
        }
    },
    customize: function(constructor) {

        constructor.prototype._proxyData.push(function(x, y) {
            var that = this,
                data;
            that._labels.forEach(function(label, index) {
                var rect = label.getBoundingRect();
                if(x >= rect.x && x <= (rect.x + rect.width) && y >= rect.y && y <= (rect.y + rect.height)) {
                    var pos = isOutsidePosition(that._getOption("label").position) ? "outside" : "inside";
                    data = {
                        id: index,
                        type: pos + "-label"
                    };
                    return true;
                }
            });
            return data;
        });

        constructor.addChange({
            code: "LABEL",
            handler: function() {
                this._createLabels();
                this._requestChange(["LAYOUT"]);
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "label"
        });
    }
};
