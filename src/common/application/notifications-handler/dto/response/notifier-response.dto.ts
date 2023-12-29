import { EventResponse } from "src/common/application/events/dto/response/event-response.dto";

export interface NotifierResponse{
    successfulTokens: string[];
    unsuccessfulTokens: string[];
}

