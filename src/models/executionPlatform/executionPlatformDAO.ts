import { ExecutionPlatform } from "@controllers/executionPlatform/executionPlatform";
import { DAO } from "@interfaces/controllers/DAO";
import { ExecutionPlatformResponse } from "@interfaces/controllers/executionPlatform/executionPlatform";
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

                resolve(entity);
            });
        });
    }

    delete(entity: ExecutionPlatform): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM ExecutionPlatforms WHERE id = ?", entity.id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);

                resolve();
            });
        });
    }

    async get(id: number): Promise<ExecutionPlatform> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM ExecutionPlatforms WHERE ID = ?', id, function(err: Error | null, rows: ExecutionPlatformResponse) { 
                if(err) reject(err);

                if(rows) resolve(new ExecutionPlatform(rows.id, rows.name));
                else reject();
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
                else reject();
            });
        });
    }
}