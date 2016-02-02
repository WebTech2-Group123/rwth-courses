app.filter('course', function () {
    return function (input) {
        var str = input || '';
        var out = '';

        if (str.length > 40) {
            out = str.substr(0, 40) + '...';
        } else {
            out = str;
        }

        return out;
    }
})