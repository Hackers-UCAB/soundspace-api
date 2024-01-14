import { Result } from "./result-handler/result";

export interface IDomainService<D, R>{
    execute(dto: D): Promise<Result<R>>;
}