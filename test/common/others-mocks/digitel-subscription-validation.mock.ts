import { Result } from "src/common/application/result-handler/result";
import { IDigitelSubscriptionValidation } from "src/subscription/domain/validation/digitel-subscription-validation.interface";


export class DigitelSubscriptionValidationMock implements IDigitelSubscriptionValidation{
    async validateSubscription(value: string): Promise<Result<boolean>> {
        return Result.success(true, 200)
    }

}