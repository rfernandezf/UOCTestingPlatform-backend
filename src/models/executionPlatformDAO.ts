import { ExecutionPlatform } from "@controllers/executionPlatform";
import { DAO } from "@interfaces/controllers/DAO";
import { ExecutionPlatformResponse } from "@interfaces/controllers/executionPlatform";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";

export class ExecutionPlatformDAO implements DAO<ExecutionPlatform>
{
    private db = dbConnection;

    constructor() { }

    create(entity: ExecutionPlatform): Promise<ExecutionPlatform> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("INSERT INTO ExecutionPlatforms (name) VALUES (?)", entity.name, function (this: RunResult, err: Error | null) { 
                if(this.lastID) entity.id = this.lastID;

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: ExecutionPlatform): Promise<ExecutionPlatform> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE ExecutionPlatforms SET name = ? WHERE id = ?", entity.name, entity.id, function (this: RunResult, err: Error | null) {                
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve(entity);
            });
        });
    }

    delete(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM ExecutionPlatforms WHERE id = ?", id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve();
            });
        });
    }

    async get(id: number): Promise<ExecutionPlatform> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM ExecutionPlatforms WHERE id = ?', id, function(err: Error | null, row: ExecutionPlatformResponse) { 
                if(err) reject(err);

                if(row) resolve(new ExecutionPlatform(row.id, row.name));
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getAll(): Promise<Array<ExecutionPlatform>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM ExecutionPlatforms', function(err: Error | null, rows: Array<ExecutionPlatformResponse>) { 
                if(err) reject(err);

                let response: Array<ExecutionPlatform> = [];

                rows.forEach((row: ExecutionPlatformResponse) => {
                    response.push(new ExecutionPlatform(row.id, row.name));
                })

                if(response && response.length > 0) resolve(response);
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }
}