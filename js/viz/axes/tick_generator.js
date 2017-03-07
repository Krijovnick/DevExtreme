"use strict";

var utils = require("../core/utils"),
    dateUtils = require("../../core/utils/date"),
    isExponential = require("../../core/utils/common").isExponential,
    convertDateUnitToMilliseconds = dateUtils.convertDateUnitToMilliseconds,
    dateToMilliseconds = dateUtils.dateToMilliseconds,
    adjustValue = utils.adjustValue,
    getLog = utils.getLog,
    math = Math,
    mathAbs = math.abs,
    mathFloor = math.floor,
    mathCeil = math.ceil,
    mathPow = math.pow;

var NUMBER_MULTIPLIERS = [1, 2, 2.5, 5],
    LOGARITHMIC_MULTIPLIERS = [1, 2, 3, 5],
    DATETIME_MULTIPLIERS = {
        millisecond: [1, 2, 5, 10, 25, 50, 100, 250, 500],
        second: [1, 2, 3, 5, 10, 15, 20, 30],
        minute: [1, 2, 3, 5, 10, 15, 20, 30],
        hour: [1, 2, 3, 4, 6, 8, 12],
        day: [1, 2],
        week: [1, 2],
        month: [1, 2, 3, 6]
    },
    DATETIME_MINOR_MULTIPLIERS = {
        millisecond: [1, 2, 5, 10, 25, 50, 100, 250, 500],
        second: [1, 2, 3, 5, 10, 15, 20, 30],
        minute: [1, 2, 3, 5, 10, 15, 20, 30],
        hour: [1, 2, 3, 4, 6, 8, 12],
        day: [1, 2, 3, 7, 14],
        month: [1, 2, 3, 6]
    },
    MINOR_DELIMITERS = [2, 4, 5, 8, 10];

function discreteGenerator(options) {
    return function(data, screenDelta, tickInterval, forceTickInterval) {
        var interval = data.categories.length * options.gridSpacingFactor / screenDelta;

        return {
            ticks: data.categories,
            tickInterval: interval > 4 ? mathCeil(interval) : 1
        };
    };
}

function adjustValueByPrecision(value, interval, min) {
    return isExponential(value) ? adjustValue(value) : utils.applyPrecisionByMinDelta(min, interval, value);
}

function getValue(value) {
    return value;
}

function getLogValue(base) {
    return function(value) {
        return adjustValue(getLog(value, base));
    };
}

function raiseTo(base) {
    return function(value) {
        return mathPow(base, value);
    };
}

function correctValueByInterval(post, round, getValue) {
    return function(value, interval, min) {
        return adjustValueByPrecision(post(round(getValue(value) / interval) * interval), interval, min);
    };
}

function getBusinessDelta(data) {
    return mathAbs(data.max - data.min);
}

function getBusinessDeltaLog(base) {
    var getLog = getLogValue(base);
    return function(data) {
        if(data.min === 0 || data.max === 0) {
            return;
        }
        return mathCeil(mathAbs(getLog(data.max / data.min)));
    };
}

function getIntervalByFactor(businessDelta, screenDelta, gridSpacingFactor) {
    var count = screenDelta / gridSpacingFactor;
    count = count < 1 ? 1 : count;

    return businessDelta / count;
}

function getMultiplierFactor(interval) {
    return mathPow(10, mathFloor(getLog(interval, 10)));
}

function calculateTickInterval(businessDelta, screenDelta, tickInterval, forceTickInterval, gridSpacingFactor, multipliers, allowDecimals) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, gridSpacingFactor),
        factor = getMultiplierFactor(interval),
        result = 1,
        onlyIntegers = allowDecimals === false;

    multipliers = multipliers || NUMBER_MULTIPLIERS;

    if(!forceTickInterval || !tickInterval) {
        if(interval >= 1 || (!onlyIntegers && interval > 0)) {
            result = multipliers.concat(multipliers[0] * 10).reduce(function(r, m) {
                if(factor === 1 && onlyIntegers && m === 2.5) {
                    return r;
                }
                return r < interval ? adjustValue(m * factor) : r;
            }, 0);
        }

        if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function calculateMinorTickInterval(businessDelta, screenDelta, tickInterval, gridSpacingFactor) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, gridSpacingFactor);

    return tickInterval || MINOR_DELIMITERS.reduce(function(r, d) {
        var cur = businessDelta / d;
        if(cur >= interval) {
            r = adjustValue(cur);
        }
        return r;
    }, 0);
}

function calculateTickIntervalLog(businessDelta, screenDelta, tickInterval, forceTickInterval, gridSpacingFactor, multipliers, allowDecimals) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, gridSpacingFactor),
        factor = getMultiplierFactor(interval),
        result = 0;

    multipliers = multipliers || LOGARITHMIC_MULTIPLIERS;

    if(factor < 1) {
        factor = 1;
    }
    if(!forceTickInterval || !tickInterval) {
        if(interval > 0) {
            result = multipliers.concat(multipliers[0] * 10).reduce(function(r, m) {
                return r < interval ? m * factor : r;
            }, 0);
        }

        if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function calculateTickIntervalDateTime(businessDelta, screenDelta, tickInterval, forceTickInterval, gridSpacingFactor, multipliers, allowDecimals) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, gridSpacingFactor),
        result,
        factor,
        key;

    multipliers = multipliers || DATETIME_MULTIPLIERS;

    function numbersReducer(interval, key) {
        return function(r, m) {
            if(!r && interval <= convertDateUnitToMilliseconds(key, m)) {
                r = {};
                r[key + 's'] = m;
            }
            return r;
        };
    }

    function yearsReducer(interval, factor) {
        return function(r, m) {
            var years = factor * m;
            if(!r && interval <= convertDateUnitToMilliseconds('year', years) && years !== 2.5) {
                r = { years: years };
            }
            return r;
        };
    }

    if(!forceTickInterval || !tickInterval) {
        for(key in multipliers) {
            result = multipliers[key].reduce(numbersReducer(interval, key), result);
            if(result) {
                break;
            }
        }
        if(!result) {
            for(factor = 1; ; factor *= 10) {
                result = NUMBER_MULTIPLIERS.reduce(yearsReducer(interval, factor), result);
                if(result) {
                    break;
                }
            }
        }

        if(!tickInterval || (!forceTickInterval && dateToMilliseconds(tickInterval) <= dateToMilliseconds(result))) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function calculateMinorTickIntervalDateTime(businessDelta, screenDelta, tickInterval, gridSpacingFactor) {
    return calculateTickIntervalDateTime(businessDelta, screenDelta, tickInterval, true, gridSpacingFactor, DATETIME_MINOR_MULTIPLIERS);
}

function getTickIntervalByCustomTicks(getValue, postProcess) {
    return function(ticks) {
        if(!ticks) {
            return undefined;
        }
        return postProcess(mathAbs(getValue(ticks[1]) - getValue(ticks[0]))) || 0;
    };
}

function addInterval(value, interval, min) {
    return adjustValueByPrecision(value + interval, interval, min);
}

function addIntervalLog(base) {
    return function(value, interval, min) {
        return adjustValueByPrecision(raiseTo(base)(getLog(value, base) + interval), interval, min);
    };
}

function addIntervalDate(value, interval, min) {
    return dateUtils.addInterval(value, interval);
}

function calculateTicks(addInterval, correctMinValue) {
    return function(min, max, tickInterval, endOnTicks) {
        var cur = correctMinValue(min, tickInterval, min),
            ticks = [];

        if(cur > max) {
            cur = min;
        }
        while(cur < max) {
            ticks.push(cur);
            cur = addInterval(cur, tickInterval, min);
        }
        if(endOnTicks || (cur - max === 0)) {
            ticks.push(cur);
        }
        return ticks;
    };
}

function calculateMinorTicks(updateTickInterval, addInterval, correctMinValue, correctTickValue, ceil) {
    return function(min, max, majorTicks, minorTickInterval, tickInterval) {
        var factor = tickInterval / minorTickInterval,
            lastMajor = majorTicks[majorTicks.length - 1],
            firstMajor = majorTicks[0];

        minorTickInterval = updateTickInterval(minorTickInterval, firstMajor, factor);

        //min to first tick
        var cur = correctMinValue(min, minorTickInterval, min),
            ticks = [];

        while(cur < firstMajor) {
            ticks.push(cur);
            cur = addInterval(cur, minorTickInterval, min);
        }

        //between ticks
        var middleTicks = majorTicks.reduce(function(r, tick) {
            if(r.prevTick === null) {
                r.prevTick = tick;
                return r;
            }

            minorTickInterval = updateTickInterval(minorTickInterval, tick, factor);
            var cur = correctTickValue(r.prevTick, minorTickInterval, min);
            while(cur < tick) {
                r.minors.push(cur);
                cur = addInterval(cur, minorTickInterval, min);
            }

            r.prevTick = tick;
            return r;
        }, { prevTick: null, minors: [] });

        ticks = ticks.concat(middleTicks.minors);

        //last tick to max
        minorTickInterval = updateTickInterval(minorTickInterval, ceil(max, tickInterval, min), factor);
        cur = correctTickValue(lastMajor, minorTickInterval, min);
        while(cur < max) {
            ticks.push(cur);
            cur = addInterval(cur, minorTickInterval, min);
        }

        if((lastMajor - max) !== 0 && (cur - max === 0)) {
            ticks.push(cur);
        }

        return ticks;
    };
}

function generator(options, getBusinessDelta, calculateTickInterval, calculateMinorTickInterval, getTickIntervalByCustomTicks, convertTickInterval, calculateTicks, calculateMinorTicks) {
    function processCustomTicks(customTicks) {
        return {
            tickInterval: getTickIntervalByCustomTicks(customTicks.majors),
            ticks: customTicks.majors || [],
            minorTickInterval: getTickIntervalByCustomTicks(customTicks.minors),
            minorTicks: customTicks.minors || []
        };
    }

    function correctUserTickInterval(tickInterval, businessDelta, limit) {
        if(tickInterval && (businessDelta / convertTickInterval(tickInterval)) >= limit + 1) {
            options.incidentOccurred("W2003");
            tickInterval = undefined;
        }
        return tickInterval;
    }

    function generateMajorTicks(ticks, data, businessDelta, screenDelta, tickInterval, forceTickInterval, customTicks) {
        if(customTicks.majors && !options.showCalculatedTicks) { //DEPRECATED IN 15_2
            return ticks;
        }

        tickInterval = correctUserTickInterval(tickInterval, businessDelta, screenDelta);

        tickInterval = calculateTickInterval(businessDelta, screenDelta, tickInterval, forceTickInterval, options.gridSpacingFactor, options.numberMultipliers, options.allowDecimals);
        ticks.ticks = ticks.ticks.concat(calculateTicks(data.min, data.max, tickInterval, options.endOnTicks));
        ticks.tickInterval = tickInterval;
        return ticks;
    }

    function generateMinorTicks(ticks, data, businessDelta, screenDelta, tickInterval, minorTickInterval, minorTickCount, customTicks) {
        if(!options.calculateMinors) {
            return ticks;
        }
        if(customTicks.minors && !options.showMinorCalculatedTicks) { //DEPRECATED IN 15_2
            return ticks;
        }

        var minorBusinessDelta = convertTickInterval(ticks.tickInterval),
            minorScreenDelta = screenDelta * minorBusinessDelta / businessDelta,
            majorTicks = ticks.ticks;

        if(!minorTickInterval && minorTickCount) {
            minorTickInterval = minorBusinessDelta / minorTickCount;
        }

        minorTickInterval = correctUserTickInterval(minorTickInterval, minorBusinessDelta, minorScreenDelta);

        minorTickInterval = calculateMinorTickInterval(minorBusinessDelta, minorScreenDelta, minorTickInterval, options.minorGridSpacingFactor);
        ticks.minorTicks = ticks.minorTicks.concat(calculateMinorTicks(data.min, data.max, majorTicks, minorTickInterval, tickInterval));
        ticks.minorTickInterval = minorTickInterval;

        return ticks;
    }

    return function(data, screenDelta, tickInterval, forceTickInterval, customTicks, minorTickInterval, minorTickCount) {
        customTicks = customTicks || {};

        var businessDelta = getBusinessDelta(data),
            result = processCustomTicks(customTicks);

        result = generateMajorTicks(result, data, businessDelta, screenDelta, tickInterval, forceTickInterval, customTicks);

        result = generateMinorTicks(result, data, businessDelta, screenDelta, result.tickInterval, minorTickInterval, minorTickCount, customTicks);

        return result;
    };
}

function numericGenerator(options) {
    var floor = correctValueByInterval(getValue, mathFloor, getValue),
        ceil = correctValueByInterval(getValue, mathCeil, getValue);

    return generator(
        options,
        getBusinessDelta,
        calculateTickInterval,
        calculateMinorTickInterval,
        getTickIntervalByCustomTicks(getValue, getValue),
        getValue,
        calculateTicks(addInterval, options.endOnTicks ? floor : ceil),
        calculateMinorTicks(getValue, addInterval, options.endOnTicks ? floor : ceil, addInterval, getValue)
    );
}

function logarithmicGenerator(options) {
    function updateTickInterval(tickInterval, tick, factor) {
        return tick / factor;
    }

    var base = options.logBase,
        raise = raiseTo(base),
        log = getLogValue(base),
        floor = correctValueByInterval(raise, mathFloor, log),
        ceil = correctValueByInterval(raise, mathCeil, log),
        ceilNumber = correctValueByInterval(getValue, mathCeil, getValue);

    return generator(
        options,
        getBusinessDeltaLog(base),
        calculateTickIntervalLog,
        calculateMinorTickInterval,
        getTickIntervalByCustomTicks(log, getValue),
        getValue,
        calculateTicks(addIntervalLog(base), options.endOnTicks ? floor : ceil),
        calculateMinorTicks(updateTickInterval, addInterval, ceilNumber, ceilNumber, ceil)
    );
}

function dateGenerator(options) {
    function floor(value, interval) {
        var floorNumber = correctValueByInterval(getValue, mathFloor, getValue),
            divider = dateToMilliseconds(interval);

        value = dateUtils.correctDateWithUnitBeginning(value, interval);

        if("years" in interval) {
            value.setFullYear(floorNumber(value.getFullYear(), interval.years, 0));
        } else if("quarters" in interval) {
            //correctDateWithUnitBeginning is enough here
        } else if("months" in interval) {
            value.setMonth(floorNumber(value.getMonth(), interval.months, 0));
        } else if("weeks" in interval) {
            //correctDateWithUnitBeginning is enough here
        } else if("days" in interval) {
            //correctDateWithUnitBeginning is enough here
        } else if("hours" in interval) {
            value.setHours(floorNumber(value.getHours(), interval.hours, 0));
        } else if("minutes" in interval) {
            value.setMinutes(floorNumber(value.getMinutes(), interval.minutes, 0));
        } else if("seconds" in interval) {
            value.setSeconds(floorNumber(value.getSeconds(), interval.seconds, 0));
        } else if("milliseconds" in interval) {
            value = new Date(mathFloor(value.getTime() / divider) * divider);
        }

        return value;
    }

    function ceil(value, interval) {
        var newValue = floor(value, interval);
        if(value - newValue > 0) {
            newValue = addIntervalDate(newValue, interval);
        }
        return newValue;
    }

    return generator(
        options,
        getBusinessDelta,
        calculateTickIntervalDateTime,
        calculateMinorTickIntervalDateTime,
        getTickIntervalByCustomTicks(getValue, dateUtils.convertMillisecondsToDateUnits),
        dateToMilliseconds,
        calculateTicks(addIntervalDate, options.endOnTicks ? floor : ceil),
        calculateMinorTicks(getValue, addIntervalDate, options.endOnTicks ? floor : ceil, addIntervalDate, getValue)
    );
}

// {
//     dataType: "numeric",
//     axisType: "continuous",
//     gridSpacingFactor: 30,
//     minorGridSpacingFactor: 10,
//     allowDecimals: true,
//     endOnTicks: true,
//     logBase: 2,
//     calculateMinors: false,
//     incidentOccurred: () => {},
//     numberMultipliers: [1, 2]
// }
exports.tickGenerator = function(options) {
    var result;

    if(options.axisType === "discrete") {
        result = discreteGenerator(options);
    } else if(options.axisType === "logarithmic") {
        result = logarithmicGenerator(options);
    } else if(options.dataType === "numeric") {
        result = numericGenerator(options);
    } else if(options.dataType === "datetime") {
        result = dateGenerator(options);
    }

    return result;
};
