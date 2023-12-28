import { Injectable, Logger } from "@nestjs/common";
import { LoggerDto } from "src/common/application/dto/logger.dto";
import { ILogger} from "src/common/application/logging-handler/logger.interface";

@Injectable()
export class LoggerImpl implements ILogger{
    logError(log: LoggerDto): void {
        Logger.error(`Error when user: ${log.user} executed ${log.operation} whit data: ${log.data}`);
    }
    logSuccess(log: LoggerDto): void {
        Logger.log(`Success when user: ${log.user} executed ${log.operation} whit data: ${log.data}`);
    }
    
    //TODO: Arreglar esto
    execute(log: LoggerDto): void {
        Logger.verbose(
            "\x1b[33m[" + log.operation + "] " + //Esta linea pone en corchetes el nombre de la operacion, el 33 lo pone en amarillo y el 36 en ciab
            "\x1b[36m" + log.data + "\x1b[0m"
        );
    }
    
}