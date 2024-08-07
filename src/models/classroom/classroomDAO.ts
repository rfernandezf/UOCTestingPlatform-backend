import { Classroom } from "@controllers/classroom/classroom";
import { ClassroomResponse } from "@interfaces/controllers/classroom/classroom";
import { DAO } from "@interfaces/controllers/DAO";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";

export class ClassroomDAO implements DAO<Classroom>
{
    private db = dbConnection;

    constructor() { }

    create(entity: Classroom): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("INSERT INTO Classrooms (name, description) VALUES (?, ?)", [entity.name, entity.description], function (this: RunResult, err: Error | null) { 
                if(this.lastID) entity.id = this.lastID;

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: Classroom): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE Classrooms SET name = ?, description = ? WHERE id = ?", [entity.name, entity.description, entity.id], function (this: RunResult, err: Error | null) {                
                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    delete(entity: Classroom): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM Classrooms WHERE id = ?", entity.id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);

                resolve();
            });
        });
    }

    async get(id: number): Promise<Classroom> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Classrooms WHERE id = ?', id, function(err: Error | null, row: ClassroomResponse) { 
                if(err) reject(err);

                if(row) resolve(new Classroom(row.id, row.name, row.description));
                else reject();
            });
        });
    }

    getAll(): Promise<Array<Classroom>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM Classrooms', function(err: Error | null, rows: Array<ClassroomResponse>) { 
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