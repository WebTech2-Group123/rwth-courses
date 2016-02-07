// limit to max len
app.filter('course', function () {
    var MAX_LEN = 50;
    return function (input) {
        return input && input.length <= MAX_LEN ? input : input.substr(0, MAX_LEN) + ' ...';
    }
});