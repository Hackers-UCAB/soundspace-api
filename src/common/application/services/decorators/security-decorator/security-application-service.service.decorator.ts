import { Result } from 'src/common/domain/result-handler/result';
import { ServiceEntry } from '../../dto/entry/service-entry.dto';
import { ServiceResponse } from '../../dto/response/service-response.dto';
import { IApplicationService } from '../../interfaces/application-service.interface';
import { ApplicationServiceDecorator } from '../application-service.decorator';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { User } from 'src/user/domain/user';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';

export class SecurityApplicationServiceDecorator<
  D extends ServiceEntry,
  R extends ServiceResponse,
> extends ApplicationServiceDecorator<D, R> {
  private readonly userRepository: IUserRepository;
  private readonly allowedRoles: UserRoleEnum[];
  constructor(
    applicationService: IApplicationService<D, R>,
    userRepository: IUserRepository,
    roles: UserRoleEnum[],
  ) {
    super(applicationService);
    this.allowedRoles = roles;
    this.userRepository = userRepository;
  }

  async execute(param: D): Promise<Result<R>> {
    const userId: UserId = UserId.create(param.userId);
    const userResult: Result<User> = await this.userRepository.findUserById(userId);

    if (!userResult.IsSuccess) {
      return Result.fail(null, userResult.statusCode, userResult.message, userResult.error);
    }

    const allowed: boolean = await this.checkAuthorization(userResult.Data);
    if (!allowed) {
      return Result.fail(null, 403, 'Este usuario no tiene permisos para realizar esta operacion', new Error('Este usuario no tiene permisos para realizar esta operacion'));
    }
    return await super.execute(param);
    // return this.applicationService.execute(param);
  }

  private async checkAuthorization(user: User): Promise<boolean> {
    let allowed: boolean = true;
    if (!this.allowedRoles) return allowed;
    
    if (this.allowedRoles.length === 0) return allowed;
    
    if(!this.allowedRoles.includes(user.Role.Role)) allowed = false;
    
    return allowed;
  }
}
