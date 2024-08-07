const fs = require('fs');
import sqlite3 from 'sqlite3';
import { GenericDBConnection } from '@interfaces/controllers/DB/genericDBConnection';
import { parseSQLFile } from '@utils/dbUtils';


export class SQLiteConnection implements GenericDBConnection
{
    private db: sqlite3.Database;
    private testDB: sqlite3.Database;

    constructor() { };
    
    async getConnection(testingDB?: boolean): Promise<sqlite3.Database> {
        if(testingDB) 
        {
            this.testDB = await this.initConnection(this.testDB, "./common/database_test.sqlite");
            return this.testDB;
        }

        else
        {
            this.db = await this.initConnection(this.db, "./common/database.sqlite");
            return this.db;
        }
    }

    private initConnection(db: sqlite3.Database, dbPath: string): Promise<sqlite3.Database> {
        return new Promise(async (resolve, reject) => {
            if(!db) db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err: Error | null) => 
            { 
                if(err != null) reject(new Error('Error initializing SQLite3 engine: ' + err));
            });

            if (!fs.existsSync(dbPath)) await this.generateDatabase(db);

            resolve(db);
        });
    }    

    private generateDatabase(db: sqlite3.Database): Promise<void>
    {
        return new Promise((resolve, reject) => {
            // Read SQL script
            const dataSql: string = fs.readFileSync('./common/generateDatabase.sql').toString();

            let sqlQueries = parseSQLFile(dataSql);

            db.serialize(() => {
                // Execute each query separately
                db.run('BEGIN TRANSACTION;');

                sqlQueries.forEach((query: string) => {
                    db.run(query, (err) => {
                        if(err) reject(err);
                    });
                });
                db.run('COMMIT;');

                resolve();
            });
        });
    }
}