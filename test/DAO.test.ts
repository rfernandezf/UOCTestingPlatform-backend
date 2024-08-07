const fs = require('fs');

if (fs.existsSync("./common/database.sqlite")) fs.unlinkSync("./common/database.sqlite", (err: any)=> {});

import "@models/executionPlatformDAO.spec"
import "@models/classroomDAO.spec"
import "@models/assessmentDAO.spec"
import "@models/userDAO.spec"
import "@models/classroomsUsersDAO.spec"