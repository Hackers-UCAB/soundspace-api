import { Result } from "src/common/domain/result-handler/result";

export interface IMovistarSubscriptionValidation{
    validateSubscription(value: string): Promise<Result<boolean>>;
}