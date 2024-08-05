import { SQLiteConnectionFactory } from "@interfaces/controllers/DB/sqliteConnectionFactory";

let dbConnectionFactory = new SQLiteConnectionFactory();
let dbConnection = dbConnectionFactory.createConnection().getConnection();

export default dbConnection;