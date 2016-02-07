app.filter('time', function () {
    return function (input) {
        if (input) {
            var input = new Date(input);
            return input.getHours() + ':' + input.getMinutes() + 'h';
        }else{
            return 'no time';
        }
    }
});