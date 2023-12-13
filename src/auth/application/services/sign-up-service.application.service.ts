import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { ISubscriptionChanelRepository } from 'src/subscription/domain/repositories/subscription-chanel.repository.interface';
import { SignUpApplicationDto } from '../dto/sign-up.application.dto';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { ISubscriptionValidation } from 'src/subscription/domain/validation/subcscription-validaion.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { SubscriptionCreatedDate } from 'src/subscription/domain/value-objects/subscription-created-date';
import { SubscriptionEndDate } from 'src/subscription/domain/value-objects/subscription-end-date';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { SubscriptionStatusEnum } from 'src/subscription/domain/enums/subscription-status.enum';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';
import { User } from 'src/user/domain/user';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { IJwtGenerator } from '../interface/jwt-generator.interface';
import { UserToken } from 'src/user/domain/value-objects/user-token';

export class SignUpApplicationService
  implements IApplicationService<SignUpApplicationDto, string>
{
  private readonly userRepository: IUserRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly subscriptionChanelRepository: ISubscriptionChanelRepository;

  private readonly idGenerator: IIdGenerator<string>;
  private readonly subscriptionValidation: ISubscriptionValidation;
  private readonly tokenGenerator: IJwtGenerator;

  constructor(
    userRepository: IUserRepository,
    subscriptionRepository: ISubscriptionRepository,
    subscriptionChanelRepository: ISubscriptionChanelRepository,
    idGenerator: IIdGenerator<string>,
    subscriptionValidation: ISubscriptionValidation,
    tokenGenerator: IJwtGenerator,
  ) {
    this.idGenerator = idGenerator;
    this.subscriptionChanelRepository = subscriptionChanelRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.subscriptionValidation = subscriptionValidation;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(param: SignUpApplicationDto): Promise<Result<string>> {
    
    const chanel: Result<SubscriptionChanel> =
      await this.subscriptionChanelRepository.findSubscriptionChanelById(
        SubscriptionChanelId.create(param.chanelId),
      );
        
    if(!chanel.IsSuccess){
      return Result.fail(null, chanel.StatusCode, chanel.message, chanel.Error);
    }
    
    const valid: Result<boolean> = await SubscriptionChanel.validateSubscription(
      this.subscriptionValidation,
      param.chanelId,
      param.value,
      chanel.Data.UrlValidation.Url,
    );

    if (!valid.IsSuccess) {
      return Result.fail(
        null,
        valid.StatusCode,
        valid.message,
        new Error(valid.message),
      );
    }
    const userId = this.idGenerator.generate();

    const newUser = await User.create(
      UserId.create(userId),
      UserRole.create(UserRoleEnum.USER),
      UserToken.create(param.firebaseToken)
    );

    //TODO: Analizar si lo de la fecha final debe ser un servicio de dominio

    const createdOn = SubscriptionCreatedDate.create(new Date());

    const newSubscription = await Subscription.create(
      SubscriptionId.create(this.idGenerator.generate()),
      SubscriptionStatus.create(SubscriptionStatusEnum.ACTIVE),
      createdOn,
      Subscription.calculateEndDate(createdOn),
      SubscriptionValue.create(param.value),
      UserId.create(userId),
    );
    
    const userCreation: Result<string> = await this.userRepository.saveAggregate(newUser);
    if(!userCreation.IsSuccess){
      return Result.fail(
        null,
        userCreation.StatusCode,
        userCreation.message,
        new Error(userCreation.message),
      );
    }

    const subscriptionCreation: Result<string> = await this.subscriptionRepository.saveAggregate(newSubscription);
    if(!subscriptionCreation.IsSuccess){
      const deleteUserCreation: Result<string> = await this.userRepository.deleteUserById(userId);
      return Result.fail(
        null,
        subscriptionCreation.StatusCode,
        subscriptionCreation.message,
        new Error(subscriptionCreation.message),
      );
    }

    return Result.success(this.tokenGenerator.create({ id: userId }), 201);
  }
}
