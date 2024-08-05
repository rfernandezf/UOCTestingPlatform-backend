export interface DAO<T> 
{
  create(entity: T): T;
  update(entity: T): T;
  delete(entity: T): void;
  get(id: number): T;
  getAll(): Set<T>;
}