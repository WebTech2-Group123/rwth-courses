'use strict';


const COURSE_A = {
    gguid: '0x0001',
    field: 'some value'
};

const COURSE_B = {
    gguid: '0x0002',
    field: 'some other value'
};


require('./mongo').createClient().then(db => {

    db._drop().then(() => {
        return db.insertCourse(COURSE_A);
    }).then(result => {
        return db.insertCourse(COURSE_A);
    }).then(result => {

        console.log('ok');

    }).catch(err => {
        console.log(err);
    });


});

//setTimeout(() => {
//    db.renameTempCourses();
//}, 1000);

setTimeout(process.exit, 10000);
