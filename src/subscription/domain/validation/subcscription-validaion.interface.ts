import { Result } from "src/common/application/result-handler/result";

export interface ISubscriptionValidation{
    validateSubscription(chanel: string, value: string, url: string): Promise<Result<boolean>>;
}