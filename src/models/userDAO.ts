import { User } from "@controllers/user";
import { DAO } from "@interfaces/controllers/DAO";
import { UserResponse, UserRole } from "@interfaces/controllers/user";
import dbConnection from "@utils/dbConnection";
import { RunResult } from "sqlite3";

export class UserDAO implements DAO<User>
{
    private db = dbConnection;

    constructor() { }

    create(entity: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("INSERT INTO Users (name, surnames, email, password, role_id) VALUES (?, ?, ?, ?, ?)", [entity.name, entity.surnames, entity.email, entity.password, entity.userRole], function (this: RunResult, err: Error | null) { 
                if(this.lastID) entity.id = this.lastID;

                if(err) reject(err);

                resolve(entity);
            });
        });
    }

    update(entity: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("UPDATE Users SET name = ?, surnames = ?, email = ?, password = ?, role_id = ? WHERE id = ?", [entity.name, entity.surnames, entity.email, entity.password, entity.userRole, entity.id], function (this: RunResult, err: Error | null) {                
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve(entity);
            });
        });
    }

    delete(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            (await this.db).run("DELETE FROM Users WHERE id = ?", id, function (this: RunResult, err: Error | null) { 
                if(err) reject(err);
                if(this.changes == 0) reject(new Error('ELEMENT_NOT_FOUND'));

                resolve();
            });
        });
    }

    async get(id: number): Promise<User> {
        return new Promise(async (resolve, reject) => {
            (await this.db).get('SELECT * FROM Users WHERE ID = ?', id, function(err: Error | null, row: UserResponse) { 
                if(err) reject(err);

                if(row) resolve(new User(row.id, row.name, row.surnames, row.email, row.password, row.role_id));
                else reject(new Error('ELEMENT_NOT_FOUND'));
            });
        });
    }

    getAll(): Promise<Array<User>> {
        return new Promise(async (resolve, reject) => {
            (await this.db).all('SELECT * FROM Users', function(err: Error | null, rows: Array<UserResponse>) { 
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
}