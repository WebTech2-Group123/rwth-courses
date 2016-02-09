# RWTH Courses: find your courses easily!
[![Build Status](https://travis-ci.org/WebTech2-Group123/rwth-courses.svg?branch=master)](https://travis-ci.org/WebTech2-Group123/rwth-courses)

Project of Advanced Web Technologies, Group 123.


## Technlogies
This project is build on top of Node.js and MongoDB. Please make sure to have a running MongoDB instance before launching this project. By default, the application tries to connect to the database 'rwth-courses' on localhost (without autentication). If you need to change this behaviour, pass a MongoDB URI as MONGO_URL environment variable.

## Run the project
 - clone the repository
 - install dependencies
 - restore database dump / run the worker
 - npm start
```bash
# clone repository
git clone https://github.com/WebTech2-Group123/rwth-courses.git
cd rwth-courses

# install dependencies
npm install

# restore db
mongorestore dump/rwth-courses/courses.bson

# or run the worker
API_BASE=<api_url> npm run worker

# run the project
npm start
```

