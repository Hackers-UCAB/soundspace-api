import { UserId } from "src/user/domain/value-objects/user-id";

export interface NotifierDto {
    userId: UserId;
    tittle: string;
    body: string;   
    data: Map<string, any>;
}