'use strict';

var db = require('./mongo').createClient();

setTimeout(() => {
    db.renameTempCourses();
}, 1000);

setTimeout(process.exit, 3000);
