/* ----- DROP OLD TABLES IF EXISTS ----- */
-- DROP TABLE IF EXISTS ExecutionPlatforms;
-- DROP TABLE IF EXISTS Assessments;
-- DROP TABLE IF EXISTS Classrooms;
-- DROP TABLE IF EXISTS UserRoles;
-- DROP TABLE IF EXISTS Users;
-- DROP TABLE IF EXISTS Classrooms_2_users;

/* ----- CREATE NEW TABLES ----- */
CREATE TABLE ExecutionPlatforms (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT UNIQUE NOT NULL,
	internal_name TEXT UNIQUE NOT NULL
);

CREATE TABLE Assessments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT UNIQUE NOT NULL,
	description TEXT NOT NULL,
	publish_date INTEGER NOT NULL,
	expiration_date INTEGER NOT NULL,
	platform_id INTEGER,
	classroom_id INTEGER,
	test_path TEXT NOT NULL,
	file_name TEXT NOT NULL,
	max_failed_tests INTEGER,
	max_retries INTEGER,
	FOREIGN KEY(platform_id) REFERENCES ExecutionPlatforms(id) ON DELETE CASCADE,
	FOREIGN KEY(classroom_id) REFERENCES Classrooms(id) ON DELETE CASCADE
);

CREATE TABLE AssessmentExecutions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	assessment_id INTEGER,
	user_id INTEGER,
	execution_date INTEGER NOT NULL,
	passed_tests INTEGER NOT NULL,
	failed_tests INTEGER NOT NULL,
	execution_time INTEGER NOT NULL,
	log_output TEXT NOT NULL,
	execution_id TEXT NOT NULL,
	FOREIGN KEY(assessment_id) REFERENCES Assessments(id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Classrooms (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT UNIQUE NOT NULL,
	description TEXT NOT NULL,
	password TEXT,
	uuid TEXT UNIQUE NOT NULL
);

CREATE TABLE UserRoles (
	id INTEGER PRIMARY KEY,
	name TEXT UNIQUE NOT NULL
);

CREATE TABLE Users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	surnames TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	role_id INTEGER,
	FOREIGN KEY(role_id) REFERENCES UserRoles(id) ON DELETE CASCADE
);

CREATE TABLE Classrooms_2_users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	classroom_id INTEGER,
	user_id INTEGER,
	FOREIGN KEY(classroom_id) REFERENCES Classrooms(id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
	CONSTRAINT unique_pair UNIQUE(classroom_id, user_id)
);

/* ----- INSERTS ----- */
INSERT INTO UserRoles VALUES (1, 'ADMIN');
INSERT INTO UserRoles VALUES (2, 'STUDENT');
INSERT INTO UserRoles VALUES (3, 'TEACHER');

/* ----- TEST DATA ----- */
-- INSERT INTO ExecutionPlatforms (name) VALUES ('Test');

-- INSERT INTO Assessments (publish_date, expiration_date, platform_id, test_path) 
-- VALUES (0, 0, 1, '/my/path/here');

-- INSERT INTO Classrooms (name, description, assessment_id) 
-- VALUES ('Test classroom', 'My description comes here', 1);

-- INSERT INTO Users (name, surnames, email, password, role_id)
-- VALUES ('Rafael', 'Fernández Flores', 'rfernandezflo@uoc.edu', '1234', 1);

-- INSERT INTO Classrooms_2_users VALUES (1, 1);