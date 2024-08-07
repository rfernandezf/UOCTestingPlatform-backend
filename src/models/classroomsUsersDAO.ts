import { Classroom } from "@controllers/classroom/classroom";
import { User } from "@controllers/user/user";
import { ClassroomResponse } from "@interfaces/controllers/classroom/classroom";
import { UserResponse } from "@interfaces/controllers/user/user";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";

export class ClassroomsUsersDAO
{
    private db = dbConnection;

    constructor() { }

    public addUserToClassroom(user: User, classroom: Classroom): Promise<void>
    {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("INSERT INTO Classrooms_2_users (classroom_id, user_id) VALUES (?, ?)", [classroom.id, user.id], function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                resolve();
            });
        });
    }

    public deleteUserFromClassroom(user: User, classroom: Classroom): Promise<void>
    {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM Classrooms_2_users WHERE classroom_id = ? AND user_id = ?", [classroom.id, user.id], function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                resolve();
            });
        });
    }

    public getUsersInClassroom(classroom: Classroom): Promise<Array<User>>
    {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT u.* FROM Classrooms c, Users u, Classrooms_2_users cu WHERE c.id = cu.classroom_id AND u.id = cu.user_id AND c.id = ' + classroom.id, function(err: Error | null, rows: Array<UserResponse>) { 
                if(err) reject(err);

                let response: Array<User> = [];

                rows.forEach((row: UserResponse) => {
                    response.push(new User(row.id, row.name, row.surnames, row.email, row.password, row.role_id));
                })

                if(response && response.length > 0) resolve(response);
                else reject();
            });
        });
    }

    public getClassroomsInUser(user: User): Promise<Array<Classroom>>
    {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT c.* FROM Classrooms c, Users u, Classrooms_2_users cu WHERE c.id = cu.classroom_id AND u.id = cu.user_id AND u.id = ' + user.id, function(err: Error | null, rows: Array<ClassroomResponse>) { 
                if(err) reject(err);

                let response: Array<Classroom> = [];

                rows.forEach((row: ClassroomResponse) => {
                    response.push(new Classroom(row.id, row.name, row.description));
                })

                if(response && response.length > 0) resolve(response);
                else reject();
            });
        });
    }

}