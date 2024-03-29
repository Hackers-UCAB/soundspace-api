import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SignUpEntryApplicationDto } from '../dto/entry/sign-up-entry.application.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IJwtGenerator } from '../interface/jwt-generator.interface';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { IMovistarSubscriptionValidation } from 'src/subscription/domain/validation/movistar-subscription-validation.interface';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { SubscriptionCreatedDate } from 'src/subscription/domain/value-objects/subscription-created-date';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { SubscriptionStatusEnum } from 'src/subscription/infrastructure/persistence-entities/orm-entities/orm-subscription.entity';
import { Subscription } from 'src/subscription/domain/subscription';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SignUpResponseApplicationDto } from '../dto/response/sign-up-response.application.dto';

export class SignUpMovistarApplicationService
  implements
    IApplicationService<
      SignUpEntryApplicationDto,
      SignUpResponseApplicationDto
    >
{
  private readonly userRepository: IUserRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;

  private readonly idGenerator: IIdGenerator<string>;
  private readonly movistarSubscriptionValidation: IMovistarSubscriptionValidation;
  private readonly tokenGenerator: IJwtGenerator;

  private readonly eventPublisher: IEventPublisher;

  constructor(
    userRepository: IUserRepository,
    subscriptionRepository: ISubscriptionRepository,
    idGenerator: IIdGenerator<string>,
    movistarSubscriptionValidation: IMovistarSubscriptionValidation,
    tokenGenerator: IJwtGenerator,
    eventPublisher: IEventPublisher,
  ) {
    this.userRepository = userRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.idGenerator = idGenerator;
    this.movistarSubscriptionValidation = movistarSubscriptionValidation;
    this.tokenGenerator = tokenGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute(
    param: SignUpEntryApplicationDto,
  ): Promise<Result<SignUpResponseApplicationDto>> {
    //Se valida con el api externo
    const valid: Result<boolean> =
      await this.movistarSubscriptionValidation.validateSubscription(
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
    //Se encapsulan las posibles excepciones de dominio
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
        error.statusCode || 500,
        error.message ||
          'Ha ocurrido un error inesperado creando el usuario y/o la subscripción, hable con un administrador',
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
    await this.eventPublisher.publish(newSubscription.pullDomainEvents());

    const response: SignUpResponseApplicationDto = {
      userId,
      token: this.tokenGenerator.create({ id: userId }),
    };
    return Result.success(response, 201);
  }
}
