import { SQLiteConnectionFactory } from "@models/DB/sqliteConnectionFactory";

let dbConnectionFactory = new SQLiteConnectionFactory();
let dbConnection = dbConnectionFactory.createConnection().getConnection();

export default dbConnection;