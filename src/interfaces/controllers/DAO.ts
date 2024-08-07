export interface DAO<T> 
{
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
  get(id: number): Promise<T>;
  getAll(): Promise<Array<T>>;
}