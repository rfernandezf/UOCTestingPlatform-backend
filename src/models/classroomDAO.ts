import { Classroom } from "@controllers/classroomControlller";
import { ClassroomResponse } from "@interfaces/classroom";
import { DAO } from "@interfaces/DAO";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";
import { v4 as uuidv4 } from 'uuid';

export class ClassroomDAO implements DAO<Classroom>
{
    private db = dbConnection;

    constructor() { }

    create(entity: Classroom): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            let classroomUUID: string = uuidv4();

            (await this.db).run("INSERT INTO Classrooms (name, description, password, uuid) VALUES (?, ?, ?, ?)", [entity.name, entity.description, entity.password, classroomUUID], function (this: RunResult, err: Error | null) { 
                if(this.lastID) entity.id = this.lastID;
                entity.uuid = classroomUUID;

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: Classroom): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            // Workaround, if password is empty we're not updating it
            // The good solution should be to do a PATCH method and make the password and other fields optional when sending the request
            if(entity.password == "")
            {
                (await this.db).run("UPDATE Classrooms SET name = ?, description = ? WHERE id = ?", [entity.name, entity.description, entity.id], function (this: RunResult, err: Error | null) {                
                    if(err) reject(err);
                    if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                    resolve(entity);
                });
            }

            else
            {
                (await this.db).run("UPDATE Classrooms SET name = ?, description = ?, password = ? WHERE id = ?", [entity.name, entity.description, entity.password, entity.id], function (this: RunResult, err: Error | null) {                
                    if(err) reject(err);
                    if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                    resolve(entity);
                });
            }
        }
    );
    }

    delete(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM Classrooms WHERE id = ?", id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve();
            });
        });
    }

    async get(id: number): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Classrooms WHERE id = ?', id, function(err: Error | null, row: ClassroomResponse) { 
                if(err) reject(err);

                if(row) resolve(new Classroom(row.id, row.name, row.description, row.password, row.uuid));
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getAll(): Promise<Array<Classroom>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM Classrooms', function(err: Error | null, rows: Array<ClassroomResponse>) { 
                if(err) reject(err);

                let response: Array<Classroom> = [];

                rows.forEach((row: ClassroomResponse) => {
                    response.push(new Classroom(row.id, row.name, row.description, "", row.uuid)); // Intentionally not returning the password on getAll() for security reasons
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }
}