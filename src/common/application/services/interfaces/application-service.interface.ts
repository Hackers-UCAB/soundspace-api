import { Result } from "../../../domain/result-handler/result";
import { ServiceEntry } from "../dto/entry/service-entry.dto";
import { ServiceResponse } from "../dto/response/service-response.dto";


export interface IApplicationService<D extends ServiceEntry, R extends ServiceResponse> {
    execute(param: D): Promise<Result<R>>;
}