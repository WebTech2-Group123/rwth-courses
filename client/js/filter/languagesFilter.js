// limit to max len
app.filter('languages', function ($sce) {
    return function (input) {
        var html = input.map(function (language) {
            return '<img src="img/flags/' + language.toLowerCase() + '.png" width="30" alt="flag">'
        }).join('&nbsp;&nbsp;&nbsp;');
        return $sce.trustAsHtml(html);
    }
});