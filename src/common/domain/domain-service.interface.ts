
export interface IDomainService<D, R>{
    execute(dto: D): R;
}