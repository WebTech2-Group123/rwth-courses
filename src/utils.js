'use strict';

/*
 * Some utilities to safely parse unknown objects.
 */

// NB: we do not use 'var args = Array.prototype.slice.call(arguments)'
// see https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
exports.get = function (obj) {

    // convert arguments to real array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
    }

    // custom get
    return args.filter((obj, index) => index >= 1)
        .reduce((acc, obj) => typeof acc == 'undefined' ? acc : acc [obj], obj);
};

// NB: we do not use 'var args = Array.prototype.slice.call(arguments)'
// see https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
exports.map = function (obj) {

    // convert arguments to real array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
    }

    // custom map
    const func = args[args.length - 1];
    var array = args.filter((obj, index) => index >= 1 && index < args.length - 1)
        .reduce((acc, obj) => typeof acc == 'undefined' ? acc : acc [obj], obj);
    return (typeof array == 'undefined' ? array : array.map(func));
};