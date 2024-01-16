import { Result } from "src/common/domain/result-handler/result";
//No cumple con DRY para mantener el realismo, porque seguramente un implementacion real, sean distintas Movistar a Digitel
export interface IMovistarSubscriptionValidation{
    validateSubscription(value: string): Promise<Result<boolean>>;
}