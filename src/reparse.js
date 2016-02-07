'use strict';

// imports
const Job = require('./job');

// execute the job
Job.doJob({
    cacheOnly: true,
    informatikOnly: true,
    delaySemesters: 0,
    delayFields: 0,
    delaySubfields: 0,
    delayCoursesList: 0
});