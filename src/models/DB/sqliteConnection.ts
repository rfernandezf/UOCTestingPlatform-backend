import sqlite3 from 'sqlite3';
import { GenericDBConnection } from "@interfaces/controllers/DB/GenericDBConnection";


export class SQLiteConnection implements GenericDBConnection
{
    db: sqlite3.Database;

    constructor() { 
        this.initConnection();
    };

    initConnection(): void {
        if(!this.db) this.db = new sqlite3.Database("./common/test.sqlite", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err: Error | null) => 
        { 
            console.log('Error initializing SQLite3 engine: ', err); 
        });
    }    
    
    getConnection(): sqlite3.Database {
        return this.db;
    }
}