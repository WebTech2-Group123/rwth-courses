app.filter('week', function () {
    return function (input) {
        if (input) {
            switch (input) {
                case 1:
                    return 'Monday';
                    break;
                case 2:
                    return 'Tuesday';
                    break;
                case 3:
                    return 'Wednesday';
                    break;
                case 4:
                    return 'Thursday';
                    break;
                case 5:
                    return 'Friday';
                    break;
                case 6:
                    return 'Saturday';
                    break;
            }
        } else {
            return 'no day';
        }
    }
});