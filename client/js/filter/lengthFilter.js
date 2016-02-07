// limit to max len
app.filter('length', function () {
    return function (input, length) {
        var filter = function (input) {
            return input && input.length <= length ? input : input.substr(0, length) + '...';
        };
        if (input instanceof Array) {
            return input.map(filter);
        } else {
            return filter(input);
        }
    }
});