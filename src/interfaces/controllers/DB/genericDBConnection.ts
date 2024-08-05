

export interface GenericDBConnection
{
    db: any;
    getConnection(): any;
    initConnection(): void;
}