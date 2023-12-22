import { Result } from "src/common/application/result-handler/result";

export interface IDigitelSubscriptionValidation{
    validateSubscription(value: string): Promise<Result<boolean>>;
}