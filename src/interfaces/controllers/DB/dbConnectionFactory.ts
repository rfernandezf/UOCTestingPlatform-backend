import { GenericDBConnection } from "./GenericDBConnection";

export abstract class DBConnectionFactory {

    abstract createConnection() : GenericDBConnection;

  }