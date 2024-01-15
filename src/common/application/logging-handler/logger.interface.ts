import { LoggerDto } from "../logger/dto/logger.dto";

export interface ILogger {
    execute(log: LoggerDto): void
    logError(log: LoggerDto): void
    logSuccess(log: LoggerDto): void
}