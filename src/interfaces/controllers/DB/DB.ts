

export interface DB
{
    db: any;
    getConnection(): any;
    initConnection(): void;
}