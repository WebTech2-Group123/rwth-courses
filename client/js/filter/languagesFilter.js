// limit to max len
app.filter('languages', function ($sce) {
    return function (input) {
        var html = input.map(function (language) {
            return '<img class="flag" src="img/flags/' + language.toLowerCase() + '.png" alt="' + language + '">'
        }).join('');
        return $sce.trustAsHtml(html);
    }
});