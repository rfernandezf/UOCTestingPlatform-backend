import { SQLiteConnection } from "@models/DB/sqliteConnection";
import { DBConnectionFactory } from "../../interfaces/controllers/DB/DBConnectionFactory";

export class SQLiteConnectionFactory implements DBConnectionFactory
{    
    createConnection(): SQLiteConnection 
    {
        return new SQLiteConnection();
    }
}