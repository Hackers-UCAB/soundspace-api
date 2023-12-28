import { Result } from "src/common/application/result-handler/result";


export interface IGetBufferImageInterface {
    getFile(fileName:string): Promise<Result<Buffer>>;
}