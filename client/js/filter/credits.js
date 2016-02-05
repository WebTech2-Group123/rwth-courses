app.filter('credits', function(){
    return function (input){
        var arr = input || '';
        var out = '';

        for(var i=0; i<arr.length; i++){
            out += arr[i] + ', ';
        }

        // TODO: remove last 2 char

        return out;
    }
});