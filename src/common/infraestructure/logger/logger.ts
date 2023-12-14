import { Injectable } from "@nestjs/common";
import { ILogger, LoggerDto } from "src/common/application/logging-handler/logger.interface";

@Injectable()
export class LoggerImpl implements ILogger{
    //TODO: Arreglar esto
    execute(log: LoggerDto): void {
        console.log(log);
    }
    
}