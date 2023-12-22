import axios from 'axios';

import { Result } from "src/common/application/result-handler/result";
import { IDigitelSubscriptionValidation } from 'src/subscription/domain/validation/digitel-subscription-validation.interface';

interface ValidationResponse {
  statusCode: number;
  message: string;
  success?: boolean;
}


export class DigitelSubscriptionValidation implements IDigitelSubscriptionValidation {
    async validateSubscription(
      value: string,
    ): Promise<Result<boolean>> {
      let valid: boolean;
      let error: any;
  
      const body = {
        number: value,
        operadoraId: process.env.DIGITEL_SUBSCRIPTION_ID,
      };
  
      try {
        const httpResponse = await axios.post<ValidationResponse>(process.env.DIGITEL_SUBSCRIPTION_URL, body);
  
        if (httpResponse.data.success) {
          valid = httpResponse.data.success;
        } else {
          valid = false;
        }
      } catch (err: any) {
        error = err;
      } finally {
        if (error) {
          return Result.fail(
            null,
            error.response.data.statusCode,
            error.response.data?.message
              ? error.response.data.message
              : 'Estamos teniendo problemas para validar su subscripcion, hable con un administrador',
            error,
          );
        }
        if(!valid){
          return Result.fail(null, 404, 'No se ha podido validar la subscripcion', new Error('No se ha podido validar la subscripcion'));
        }
  
        return Result.success(true, 200);
      }
    }
  }
  
