const fs = require('fs');
import sqlite3 from 'sqlite3';
import { GenericDBConnection } from '@interfaces/controllers/DB/genericDBConnection';


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

        let sqlQueries = this.parseSQLFile(dataSql);

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

    /**
     * Gets an string with whole raw .sql script file, including whitespaces, tabs, newlines and so on.
     * Returns an ordered array of strings, where each array entry is a whole query ready to be executed.
     * 
     * @param dataSql String containing the raw sqlite file
     * @returns Ordered array of strings with one query on each entry
     */
    private parseSQLFile(dataSql: string)
    {
        // Delete all the spaces and tabs
        const dataArray: Array<string >= dataSql.toString().split('\n');

        // Parse all the comments and unnecesary info from sql file
        let sqlQueries: Array<string> = [''];
        dataArray.forEach((line: string) => {
            if(line)
            {
                // Ignore SQL comments
                if(line.startsWith('--') || line.startsWith('/*')) return;

                // Ignore all backspaces and tabs
                line = line.replaceAll('\n', '').replaceAll('\t', '');

                // Concatenate the lines that are part of the same query
                sqlQueries[sqlQueries.length - 1] += line;
                if(line.endsWith(');')) sqlQueries.push('');
            }
        });

        // Delete last element since it's trash
        sqlQueries.pop();

        return sqlQueries;
    }
}