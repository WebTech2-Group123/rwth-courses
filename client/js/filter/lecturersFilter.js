// limit to max len
app.filter('lecturers', function () {
    return function (input) {
        return input && input.map(function (el) {
                return el.name;
            }).join(',\n');
    }
});