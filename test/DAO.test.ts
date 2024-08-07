const fs = require('fs');

if (fs.existsSync("./common/database.sqlite")) fs.unlinkSync("./common/database.sqlite", (err: any)=> {});

import "@models/executionPlatform/executionPlatformDAO.spec"
import "@models/classroom/classroomDAO.spec"
import "@models/assessment/assessmentDAO.spec"
import "@models/user/userDAO.spec"
import "@models/classroomsUsersDAO.spec"