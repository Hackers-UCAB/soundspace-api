import { Result } from "../../result-handler/result";


export interface IApplicationService<D, R> {
    get name(): string;

    execute(param: D): Promise<Result<R>>;
}