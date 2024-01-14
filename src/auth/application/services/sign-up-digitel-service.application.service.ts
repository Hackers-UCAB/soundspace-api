import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SignUpEntryApplicationDto } from '../dto/entrys/sign-up-entry.application.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IJwtGenerator } from '../interface/jwt-generator.interface';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { SubscriptionCreatedDate } from 'src/subscription/domain/value-objects/subscription-created-date';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { SubscriptionStatusEnum } from 'src/subscription/infraestructure/orm-entities/subscription.entity';
import { Subscription } from 'src/subscription/domain/subscription';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { IDigitelSubscriptionValidation } from 'src/subscription/domain/validation/digitel-subscription-validation.interface';
import { SignUpResponseApplicationDto } from '../dto/responses/sign-up-response.application.dto';

export class SignUpDigitelApplicationService
  implements
    IApplicationService<
      SignUpEntryApplicationDto,
      SignUpResponseApplicationDto
    >
{
  private readonly userRepository: IUserRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;

  private readonly idGenerator: IIdGenerator<string>;
  private readonly digitelSubscriptionValidation: IDigitelSubscriptionValidation;
  private readonly tokenGenerator: IJwtGenerator;

  private readonly eventPublisher: IEventPublisher;

  constructor(
    userRepository: IUserRepository,
    subscriptionRepository: ISubscriptionRepository,
    idGenerator: IIdGenerator<string>,
    digitelSubscriptionValidation: IDigitelSubscriptionValidation,
    tokenGenerator: IJwtGenerator,
    eventPublisher: IEventPublisher,
  ) {
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.idGenerator = idGenerator;
    this.digitelSubscriptionValidation = digitelSubscriptionValidation;
    this.tokenGenerator = tokenGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute(
    param: SignUpEntryApplicationDto,
  ): Promise<Result<SignUpResponseApplicationDto>> {
    //Se valida con el api externo
    const valid: Result<boolean> =
      await this.digitelSubscriptionValidation.validateSubscription(
        param.phone,
      );

    if (!valid.IsSuccess) {
      return Result.fail(
        null,
        valid.StatusCode,
        valid.message,
        new Error(valid.message),
      );
    }
    let userId: string;
    let newUser: User;
    let newSubscription: Subscription;
    
    try {
      userId = this.idGenerator.generate();
      //Se crea el usuario
      newUser = await User.create(
        UserId.create(userId),
        UserRole.create(UserRoleEnum.USER),
      );

      const createdOn = SubscriptionCreatedDate.create(new Date());

      //Se crea la subscripcion
      newSubscription = await Subscription.create(
        SubscriptionId.create(this.idGenerator.generate()),
        SubscriptionStatus.create(SubscriptionStatusEnum.ACTIVE),
        createdOn,
        Subscription.calculateEndDate(createdOn),
        SubscriptionValue.create(param.phone),
        UserId.create(userId),
        SubscriptionChanelId.create(process.env.MOVISTAR_SUBSCRIPTION_ID),
      );
    } catch (error: any) {
      return Result.fail(
        null,
        error.statusCose || 500,
        error.message || 'Ha ocurrido un error creando el usuario y/o la subscripcion. Hable con un administrador',
        error,
      );
    }

    //Guardar al usuario
    const userSaving: Result<string> = await this.userRepository.saveAggregate(
      newUser,
      [param.token],
    );
    if (!userSaving.IsSuccess) {
      return Result.fail(
        null,
        userSaving.StatusCode,
        userSaving.message,
        new Error(userSaving.message),
      );
    }
    //Se guarda la subscripcion
    const subscriptionSaving: Result<string> =
      await this.subscriptionRepository.saveAggregate(newSubscription);

    if (!subscriptionSaving.IsSuccess) {
      const deleteUserCreation: Result<string> =
        await this.userRepository.deleteUserById(newUser.Id);
      return Result.fail(
        null,
        subscriptionSaving.StatusCode,
        subscriptionSaving.message,
        new Error(subscriptionSaving.message),
      );
    }
    this.eventPublisher.publish(newSubscription.pullDomainEvents());

    const response: SignUpResponseApplicationDto = {
      userId: userId,
      token: this.tokenGenerator.create({ id: userId }),
    };
    return Result.success(response, 201);
  }
}
