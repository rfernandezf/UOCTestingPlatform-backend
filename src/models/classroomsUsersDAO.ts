import { Classroom } from "@controllers/classroomControlller";
import { User } from "@controllers/userController";
import { ClassroomResponse } from "@interfaces/classroom";
import { UserResponse } from "@interfaces/user";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";

export class ClassroomsUsersDAO
{
    private db = dbConnection;

    constructor() { }

    public addUserToClassroom(user: number, classroom: number): Promise<void>;
    public addUserToClassroom(user: User, classroom: Classroom): Promise<void>;
    public addUserToClassroom(user: unknown, classroom: unknown): Promise<void>
    {        
        return new Promise(async (resolve, reject) => {

            let id_user = 0;
            let id_classroom = 0;

            if (typeof user === "number" && typeof classroom === "number" ) {
                id_user = user;
                id_classroom = classroom;
            }
            else if (user instanceof User && classroom instanceof Classroom) {
                id_user = user.id;
                id_classroom = classroom.id;
            }
            else reject();

            (await this.db).run("INSERT INTO Classrooms_2_users (classroom_id, user_id) VALUES (?, ?)", [id_classroom, id_user], function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));
                
                resolve();
            });
        });
    }

    public deleteUserFromClassroom(user: number, classroom: number): Promise<void>
    public deleteUserFromClassroom(user: User, classroom: Classroom): Promise<void>
    public deleteUserFromClassroom(user: unknown, classroom: unknown): Promise<void>
    {
        return new Promise(async (resolve, reject) => {

            let id_user = 0;
            let id_classroom = 0;

            if (typeof user === "number" && typeof classroom === "number" ) {
                id_user = user;
                id_classroom = classroom;
            }
            else if (user instanceof User && classroom instanceof Classroom) {
                id_user = user.id;
                id_classroom = classroom.id;
            }
            else reject();

            (await this.db).run("DELETE FROM Classrooms_2_users WHERE classroom_id = ? AND user_id = ?", [id_classroom, id_user], function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve();
            });
        });
    }

    public getUsersInClassroom(classroom: number): Promise<Array<User>>;
    public getUsersInClassroom(classroom: Classroom): Promise<Array<User>>;
    public getUsersInClassroom(classroom: unknown): Promise<Array<User>>
    {
        return new Promise(async (resolve, reject) => {

            let id = 0;

            if (typeof classroom === "number") id = classroom;
            else if (classroom instanceof Classroom) id = classroom.id;
            else reject();

            (await this.db).all('SELECT u.* FROM Classrooms c, Users u, Classrooms_2_users cu WHERE c.id = cu.classroom_id AND u.id = cu.user_id AND c.id = ' + id, function(err: Error | null, rows: Array<UserResponse>) { 
                if(err) reject(err);

                let response: Array<User> = [];

                rows.forEach((row: UserResponse) => {
                    response.push(new User(row.id, row.name, row.surnames, row.email, row.password, row.role_id));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    public getClassroomsInUser(user: number): Promise<Array<Classroom>>;
    public getClassroomsInUser(user: User): Promise<Array<Classroom>>;
    public getClassroomsInUser(user: unknown): Promise<Array<Classroom>>
    {
        return new Promise(async (resolve, reject) => {

            let id = 0;

            if (typeof user === "number") id = user;
            else if (user instanceof User) id = user.id;
            else reject();

            (await this.db).all('SELECT c.* FROM Classrooms c, Users u, Classrooms_2_users cu WHERE c.id = cu.classroom_id AND u.id = cu.user_id AND u.id = ' + id, function(err: Error | null, rows: Array<ClassroomResponse>) { 
                if(err) reject(err);

                let response: Array<Classroom> = [];

                rows.forEach((row: ClassroomResponse) => {
                    response.push(new Classroom(row.id, row.name, row.description, row.uuid));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

}