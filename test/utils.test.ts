var assert = require('assert');
//import {SQLiteConnection} from '../src/models/DB/sqliteConnection'
var dbUtils = require('@utils/dbUtils');

let sqlScript1 = '/* ----- DROP OLD TABLES IF EXISTS ----- */\n'
+ '-- DROP TABLE IF EXISTS ExecutionPlatforms;\n'
+ '-- DROP TABLE IF EXISTS Assessments;\n'
+ '-- DROP TABLE IF EXISTS Classrooms;\n'
+ '-- DROP TABLE IF EXISTS UserRoles;\n'
+ '-- DROP TABLE IF EXISTS Users;\n'
+ '-- DROP TABLE IF EXISTS Classrooms_2_users;\n'
+ '/* ----- CREATE NEW TABLES ----- */\n'
+ 'CREATE TABLE ExecutionPlatforms (\n'
+ '	id INTEGER PRIMARY KEY AUTOINCREMENT,\n'
+ '	name TEXT UNIQUE NOT NULL\n'
+ ');\n'
+ 'CREATE TABLE Assessments (\n'
+ '	id INTEGER PRIMARY KEY AUTOINCREMENT,\n'
+ '	publish_date INTEGER NOT NULL,\n'
+ '	expiration_date INTEGER NOT NULL,\n'
+ '	platform_id INTEGER,\n'
+ '	test_path TEXT NOT NULL,\n'
+ '	FOREIGN KEY(platform_id) REFERENCES ExecutionPlatforms(id)\n'
+ ');\n'
+ 'CREATE TABLE Classrooms (\n'
+ '	id INTEGER PRIMARY KEY AUTOINCREMENT,\n'
+ '	name TEXT NOT NULL,\n'
+ '	description TEXT NOT NULL,\n'
+ '	assessment_id INTEGER,\n'
+ '	FOREIGN KEY(assessment_id) REFERENCES Assessments(assessment_id)\n'
+ ');\n'
+ 'CREATE TABLE UserRoles (\n'
+ '	id INTEGER PRIMARY KEY,\n'
+ '	name TEXT UNIQUE NOT NULL\n'
+ ');\n'
+ 'CREATE TABLE Users (\n'
+ '	id INTEGER PRIMARY KEY AUTOINCREMENT,\n'
+ '	name TEXT NOT NULL,\n'
+ '	surnames TEXT NOT NULL,\n'
+ '	email TEXT NOT NULL,\n'
+ '	password TEXT NOT NULL,\n'
+ '	role_id INTEGER,\n'
+ '	FOREIGN KEY(role_id) REFERENCES UserRoles(id)\n'
+ ');\n'
+ 'CREATE TABLE Classrooms_2_users (\n'
+ '	classroom_id INTEGER,\n'
+ '	user_id INTEGER,\n'
+ '	FOREIGN KEY(classroom_id) REFERENCES Classrooms(id),\n'
+ '	FOREIGN KEY(user_id) REFERENCES Users(id)\n'
+ ');\n'
+ '/* ----- INSERTS ----- */\n'
+ 'INSERT INTO UserRoles VALUES (1, \'ADMIN\');\n'
+ 'INSERT INTO UserRoles VALUES (2, \'STUDENT\');\n'
+ '/* ----- TEST DATA ----- */\n'
+ '-- INSERT INTO ExecutionPlatforms (name) VALUES (\'Test\');\n'
+ '-- INSERT INTO Assessments (publish_date, expiration_date, platform_id, test_path)\n'
+ '-- VALUES (0, 0, 1, \'/my/path/here\');\n'
+ '-- INSERT INTO Classrooms (name, description, assessment_id)\n'
+ '-- VALUES (\'Test classroom\', \'My description comes here\', 1);\n'
+ '-- INSERT INTO Users (name, surnames, email, password, role_id)\n'
+ '-- VALUES (\'Rafael\', \'Fernández Flores\', \'rfernandezflo@uoc.edu\', \'1234\', 1);\n'
+ '-- INSERT INTO Classrooms_2_users VALUES (1, 1);';

let sqlScript2 = '/* ----- DROP OLD TABLES IF EXISTS ----- */\n';

describe('Utility methods testing', function () {

  describe('SQL script parsing', function () {
    it('Should return the expected result for the .sql script', function () {
      let expectedResult: Array<string> = [
        'CREATE TABLE ExecutionPlatforms (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE NOT NULL);',
        'CREATE TABLE Assessments (id INTEGER PRIMARY KEY AUTOINCREMENT,publish_date INTEGER NOT NULL,expiration_date INTEGER NOT NULL,platform_id INTEGER,test_path TEXT NOT NULL,FOREIGN KEY(platform_id) REFERENCES ExecutionPlatforms(id));',
        'CREATE TABLE Classrooms (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,description TEXT NOT NULL,assessment_id INTEGER,FOREIGN KEY(assessment_id) REFERENCES Assessments(assessment_id));',
        'CREATE TABLE UserRoles (id INTEGER PRIMARY KEY,name TEXT UNIQUE NOT NULL);',
        'CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,surnames TEXT NOT NULL,email TEXT NOT NULL,password TEXT NOT NULL,role_id INTEGER,FOREIGN KEY(role_id) REFERENCES UserRoles(id));',
        'CREATE TABLE Classrooms_2_users (classroom_id INTEGER,user_id INTEGER,FOREIGN KEY(classroom_id) REFERENCES Classrooms(id),FOREIGN KEY(user_id) REFERENCES Users(id));',
        "INSERT INTO UserRoles VALUES (1, 'ADMIN');",
        "INSERT INTO UserRoles VALUES (2, 'STUDENT');"
      ];

      let functionResult = dbUtils.parseSQLFile(sqlScript1);

      // Assert array lengths are equal
      assert.equal(functionResult.length, expectedResult.length)

      // Assert array content is equal line by line
      for(let i = 0; i < functionResult.length; i++)
      {
        assert.equal(functionResult[i], expectedResult[i])
      }

    });
  });

});