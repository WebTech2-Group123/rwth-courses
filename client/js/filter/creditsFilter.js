// transform array in list
app.filter('credits', function () {
    return function (input) {
        return input.join(' or ');
    }
});