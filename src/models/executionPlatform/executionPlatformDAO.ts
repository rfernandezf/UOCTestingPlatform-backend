import { ExecutionPlatform } from "@controllers/executionPlatform/executionPlatform";
import { DAO } from "@interfaces/controllers/DAO";
import { ExecutionPlatformResponse } from "@interfaces/controllers/executionPlatform/executionPlatform";
import dbConnection from "@utils/dbConnection";

export class ExecutionPlatformDAO implements DAO<ExecutionPlatform>
{
    private db = dbConnection;

    constructor() { }

    create(entity: ExecutionPlatform): Promise<ExecutionPlatform> {
        return new Promise((resolve, reject) => {
            this.db.run("INSERT INTO ExecutionPlatforms (name) VALUES ('?')", entity.name, (err: any, rows: ExecutionPlatformResponse) => { 
                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: ExecutionPlatform): Promise<ExecutionPlatform> {
        return new Promise((resolve, reject) => {
            this.db.run("UPDATE ExecutionPlatforms SET name = ? WHERE id = ?", entity.name, entity.id, (err: any, rows: ExecutionPlatformResponse) => { 
                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    delete(entity: ExecutionPlatform): Promise<void | Error> {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM ExecutionPlatforms WHERE id = ?", entity.id, (err: any, rows: ExecutionPlatformResponse) => { 
                if(err) reject(err);

                resolve();
            });
        });
    }

    async get(id: number): Promise<ExecutionPlatform> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM ExecutionPlatforms WHERE ID = ?', id, (err, rows: ExecutionPlatformResponse) => { 
                if(err) reject(err);

                resolve(new ExecutionPlatform(rows.id, rows.name));
            });
        });
    }

    getAll(): Promise<Set<ExecutionPlatform>> {
        throw new Error("Method not implemented.");
    }
}