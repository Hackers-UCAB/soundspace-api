import { LoggerDto } from "src/common/application/dto/logger.dto";
import { ILogger } from "src/common/application/logging-handler/logger.interface";


export class LoggerMock implements ILogger{
    execute(log: LoggerDto): void {
        return null
    }
    logError(log: LoggerDto): void {
        return null
    }
    logSuccess(log: LoggerDto): void {
        return null
    }
    
}