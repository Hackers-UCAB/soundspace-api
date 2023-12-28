import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { UpdateUserInfoEntryApplicationDto } from '../dto/entrys/update-user-info-entry.application.dto';
import { UpdateUserInfoResponseApplicationDto } from '../dto/responses/update-user-info-response.application.dto';
import { Result } from 'src/common/application/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';
import { UserName } from 'src/user/domain/value-objects/user-name';
import { UserBirthday } from 'src/user/domain/value-objects/user-birthday';
import { UserEmail } from 'src/user/domain/value-objects/user-email';
import { UserGender } from 'src/user/domain/value-objects/user-gender';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';

export class UpdateUserInfoApplicationService
  implements
    IApplicationService<
      UpdateUserInfoEntryApplicationDto,
      UpdateUserInfoResponseApplicationDto
    >
{
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    param: UpdateUserInfoEntryApplicationDto,
  ): Promise<Result<UpdateUserInfoResponseApplicationDto>> {
    let newUser: User;
    try {
      newUser = await User.create(param.id, param.role);

      newUser.updateUser(
        param.name ? UserName.create(param.name) : null,
        param.birthdate ? UserBirthday.create(param.birthdate) : null,
        param.email ? UserEmail.create(param.email) : null,
        param.gender ? UserGender.create(UserGenderEnum[param.gender]) : null,
      );
    } catch (error: any) {
      return Result.fail(null, error.statusCode || 500, error.message || 'Ha ocurrido un error buscando y/o actualizando el usuario', error);
    }

    const savingUserResult: Result<string> =
      await this.userRepository.saveAggregate(newUser);

    if (!savingUserResult.IsSuccess) {
      return Result.fail(
        null,
        savingUserResult.statusCode,
        savingUserResult.message,
        savingUserResult.error,
      );
    }
    const response: UpdateUserInfoResponseApplicationDto = {
      userId: param.id.Id,
      success: true,
    };
    return Result.success(response, 200);
  }
}
