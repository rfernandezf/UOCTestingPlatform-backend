export interface DAO<T> 
{
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<T>;
  getAll(): Promise<Array<T>>;
}