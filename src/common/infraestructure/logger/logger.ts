import { Injectable, Logger } from "@nestjs/common";
import { ILogger, LoggerDto } from "src/common/application/logging-handler/logger.interface";

@Injectable()
export class LoggerImpl implements ILogger{
    //TODO: Arreglar esto
    execute(log: LoggerDto): void {
        Logger.error(
            "\x1b[33m[" + log.operation + "] " + //Esta linea pone en corchetes el nombre de la operacion, el 33 lo pone en amarillo y el 36 en ciab
            "\x1b[36m" + log.data + "\x1b[0m"
        );
    }
    
}