
//D = Domain
//P = Persistence
export interface IMapper<D, P>{
    toDomain(persistence: P): D;
    
    toPersistence(domain: D): P;
}