"use strict";

var formatHelper = require("../../format_helper"),
    log10 = Math.log10,
    floor = Math.floor,
    abs = Math.abs,
    CORRECT_TAIL = /\.?0*$/,
    formats = ["fixedPoint", "thousands", "millions", "billions", "trillions", "exponential"];

function smartFormatter(tick, tickInterval) {
    var tickIntervalIndex,
        tickIndex,
        actualIndex,
        stringTick = abs(tick).toString(),
        precision = 0,
        typeFormat,
        postProcessingRequired = false,
        result,
        offset = 0,
        separatedTickInterval = tickInterval.toString().split("."),
        indexOfFormat = 0;

    if(separatedTickInterval.length > 1) {
        precision = separatedTickInterval[1].length;
        typeFormat = formats[indexOfFormat];
        postProcessingRequired = true;
    } else {
        tickIntervalIndex = floor(log10(tickInterval));
        if(tick !== 0) {
            actualIndex = tickIndex = floor(log10(abs(tick)));
        } else {
            actualIndex = tickIndex = 1;
        }

        if(tickIndex - tickIntervalIndex >= 2) {
            actualIndex = tickIntervalIndex;
        }

        indexOfFormat = floor(actualIndex / 3);
        if(indexOfFormat < 5) {
            offset = indexOfFormat * 3;
            if(tickIntervalIndex - offset === 2 && tickIndex >= 3) {
                indexOfFormat++;
                typeFormat = formats[indexOfFormat];
                offset = (indexOfFormat) * 3;
            } else {
                typeFormat = formats[indexOfFormat];
            }
        } else {
            typeFormat = formats[formats.length - 1];
        }

        if(offset !== 0 && stringTick[stringTick.length - offset] !== "0" && typeFormat !== formats[0]) {
            precision++;
            if(abs(tickInterval / Math.pow(10, tickIntervalIndex) - 2.5) < 0.0001 && stringTick[stringTick.length - offset + 1] !== "0") {
                precision++;
            }
        }
    }

    result = formatHelper.format(tick, {
        type: typeFormat,
        precision: precision
    });

    return postProcessingRequired ? result.replace(CORRECT_TAIL, "") : result;
}

exports.smartFormatter = smartFormatter;
