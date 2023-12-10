
//D = Domain
//P = Persistence
export interface IMapper<D, P>{
    toDomain(persistence: P): Promise<D>;
    
    toPersistence(domain: D): Promise<P>;
}