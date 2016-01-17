exports.get = function (obj) {
    var args = Array.prototype.slice.call(arguments);
    return args.filter((obj, index) => index >= 1)
        .reduce((acc, obj) => typeof acc == "undefined" ? acc : acc [obj], obj);
};

exports.map = function (obj) {
    var args = Array.prototype.slice.call(arguments);
    const func = args[args.length - 1];
    var array = args
        .filter((obj, index) => index >= 1 && index < args.length - 1)
        .reduce((acc, obj) => typeof acc == "undefined" ? acc : acc [obj], obj);
    return (typeof array == 'undefined' ? array : array.map(func));
};