import { Entity } from 'src/common/domain/entity';
import { SubscriptionChanelId } from './value-objects/subscription-chanel-id';
import { SubscriptionChanelName } from './value-objects/subscription-chanel-name';
import { SubscriptionChanelType } from './value-objects/subscription-chanel-type';
import { SubscriptionChanelUrlValidation } from './value-objects/subscription-chanel-url-validation';
import { ISubscriptionValidation } from '../validation/subcscription-validaion.interface';
import { Result } from 'src/common/application/result-handler/result';

export class SubscriptionChanel extends Entity<SubscriptionChanelId> {
  private name: SubscriptionChanelName;
  private type: SubscriptionChanelType;
  private urlValidation: SubscriptionChanelUrlValidation;

  get Name(): SubscriptionChanelName {
    return this.name;
  }

  get Type(): SubscriptionChanelType {
    return this.type;
  }

  get UrlValidation(): SubscriptionChanelUrlValidation {
    return this.urlValidation;
  }

  protected constructor(
    id: SubscriptionChanelId,
    name: SubscriptionChanelName,
    type: SubscriptionChanelType,
    urlValidation: SubscriptionChanelUrlValidation,
  ) {
    super(id);
    this.name = name;
    this.type = type;
    this.urlValidation = urlValidation;
  }

  static create(
    id: SubscriptionChanelId,
    name: SubscriptionChanelName,
    type: SubscriptionChanelType,
    urlValidation: SubscriptionChanelUrlValidation,
  ): SubscriptionChanel {
    const subscriptionChanel = new SubscriptionChanel(
      id,
      name,
      type,
      urlValidation,
    );
    return subscriptionChanel;
  }

  static async validateSubscription(port: ISubscriptionValidation, chanel: string, value: string, url: string):Promise<Result<boolean>>{
    return await port.validateSubscription(chanel, value, url);
  }
}
