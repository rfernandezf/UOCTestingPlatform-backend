const fs = require('fs');
import sqlite3 from 'sqlite3';
import { GenericDBConnection } from '@interfaces/controllers/DB/genericDBConnection';
import { parseSQLFile } from '@utils/dbUtils';



export class SQLiteConnection implements GenericDBConnection
{
    db: sqlite3.Database;

    constructor() { 
        this.initConnection();
    };

    initConnection(): void {
        if(!this.db) this.db = new sqlite3.Database("./common/database.sqlite", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err: Error | null) => 
        { 
            if(err != null) throw new Error('Error initializing SQLite3 engine: ' + err);
        });

        if (!fs.existsSync('./common/database.sqlite')) this.generateDatabase();
    }    
    
    getConnection(): sqlite3.Database {
        return this.db;
    }

    private generateDatabase()
    {
        // Read SQL script
        const dataSql: string = fs.readFileSync('./common/generateDatabase.sql').toString();

        let sqlQueries = parseSQLFile(dataSql);

        this.db.serialize(() => {
            // Execute each query separately
            this.db.run('BEGIN TRANSACTION;');

            sqlQueries.forEach((query: string) => {
                this.db.run(query, (err) => {
                    if(err) throw err;
                });
            });
            this.db.run('COMMIT;');
          });
    }
}