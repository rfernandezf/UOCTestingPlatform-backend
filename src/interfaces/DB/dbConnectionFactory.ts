import { GenericDBConnection } from "./genericDBConnection";

export abstract class DBConnectionFactory 
{
    abstract createConnection() : GenericDBConnection;
}