import { Result } from "src/common/domain/result-handler/result";


export interface IGetBufferImageInterface {
    getFile(fileName:string): Promise<Result<Buffer>>;
}