'use strict';

// imports
const Job = require('./job');

// execute the job
Job.doJob({
    cacheOnly: true,
    informatikOnly: false,
    delaySemesters: 0,
    delayFields: 0,
    delaySubfields: 0,
    delayCoursesList: 0
});