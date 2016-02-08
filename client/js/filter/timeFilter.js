app.filter('time', function () {
    return function (input) {
        if (input) {
            var input = new Date(input);
            var min = input.getMinutes() != 0 ? input.getMinutes() : '0' + input.getMinutes();
            return input.getHours() + ':' + min + 'h';
        }else{
            return 'no time';
        }
    }
});