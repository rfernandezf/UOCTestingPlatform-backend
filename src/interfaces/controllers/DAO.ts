export interface DAO<T> 
{
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): void;
  get(id: number): Promise<T>;
  getAll(): Promise<Set<T>>;
}