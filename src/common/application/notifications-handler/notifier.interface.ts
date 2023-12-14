import { UserId } from "src/user/domain/value-objects/user-id";

export interface NotifierDto {
    userId: UserId;
    tittle: string;
    body: string;    //data: Map<string, any>; 
}

export interface NotifierResult {
    result: [{
        userToken: string;
        messageSend: boolean;
    }]
}

export interface INotifier {
    notify(message: NotifierDto): Promise<void>;
}