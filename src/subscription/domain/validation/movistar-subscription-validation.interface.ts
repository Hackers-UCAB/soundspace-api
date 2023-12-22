import { Result } from "src/common/application/result-handler/result";

export interface IMovistarSubscriptionValidation{
    validateSubscription(value: string): Promise<Result<boolean>>;
}