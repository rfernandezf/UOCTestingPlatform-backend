const fs = require('fs');
const path = require('path');
import { environment } from '../src/utils/environment';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

if (fs.existsSync(path.join(process.env.COMMON_FOLDER!, environment.database.name))) fs.unlinkSync(path.join(process.env.COMMON_FOLDER!, environment.database.name));

// DAO testing
import "@models/executionPlatformDAO.spec"
import "@models/classroomDAO.spec"
import "@models/assessmentDAO.spec"
import "@models/userDAO.spec"
import "@models/classroomsUsersDAO.spec"

// API REST testing
import "@handlers/platformsHandler.spec"
import "@handlers/classroomsHandler.spec"
import "@handlers/usersHandler.spec"

// Other utils testing
import "./utils.test"