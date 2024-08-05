import { SQLiteConnection } from "@models/DB/sqliteConnection";

export class DBConnection
{    
    static instance: DBConnection;
    private DBEngine: SQLiteConnection;

    private constructor() { this.createDBConnection(); };

    static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }

        return DBConnection.instance;
    }

    createDBConnection()
    {
        this.DBEngine = new SQLiteConnection();
    }

    getDB()
    {
        return this.DBEngine.getConnection();
    }
}