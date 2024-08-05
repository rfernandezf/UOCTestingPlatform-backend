import { SQLiteConnection } from "@models/DB/sqliteConnection";
import { DBConnectionFactory } from "./DBConnectionFactory";

export class SQLiteConnectionFactory implements DBConnectionFactory
{    
    createConnection(): SQLiteConnection 
    {
        return new SQLiteConnection();
    }
}