import { NotifierDto } from "./dto/entry/notifier-entry.dto";
import { Result } from "../result-handler/result";
import { NotifierResponse } from "./dto/response/notifier-response.dto";

export interface INotifier {
    notify(message: NotifierDto): Promise<Result<NotifierResponse>>;
}