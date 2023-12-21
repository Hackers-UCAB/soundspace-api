import { Result } from "../../result-handler/result";
import { ServiceResponse } from "../service-response";


export interface IApplicationService<D, R extends ServiceResponse> {
    //get name(): string;

    execute(param: D): Promise<Result<R>>;
}