import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { UpdateUserInfoEntryApplicationDto } from '../dto/entrys/update-user-info-entry.application.dto';
import { UpdateUserInfoResponseApplicationDto } from '../dto/responses/update-user-info-response.application.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';
import { UserName } from 'src/user/domain/value-objects/user-name';
import { UserBirthday } from 'src/user/domain/value-objects/user-birthday';
import { UserEmail } from 'src/user/domain/value-objects/user-email';
import { UserGender } from 'src/user/domain/value-objects/user-gender';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';
import { UserId } from 'src/user/domain/value-objects/user-id';

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
    let updatedUser: User;

    try {
      const userResult: Result<User> = await this.userRepository.findUserById(
        UserId.create(param.userId),
      );
      if (!userResult.IsSuccess) {
        return Result.fail(
          null,
          userResult.statusCode,
          userResult.message,
          userResult.error,
        );
      }
      updatedUser = userResult.Data;
      if (param.name) updatedUser.updateName(UserName.create(param.name));

      if (param.birthdate)
        updatedUser.updateBirthday(UserBirthday.create(param.birthdate));

      if (param.email) updatedUser.updateEmail(UserEmail.create(param.email));

      if (param.gender)
        updatedUser.updateGender(UserGender.create(UserGenderEnum[param.gender]));
      
    } catch (error: any) {
      return Result.fail(
        null,
        error.statusCode || 500,
        error.message ||
          'Ha ocurrido un error buscando y/o actualizando el usuario',
        error,
      );
    }

    const savingUserResult: Result<string> =
      await this.userRepository.saveAggregate(updatedUser);

    if (!savingUserResult.IsSuccess) {
      return Result.fail(
        null,
        savingUserResult.statusCode,
        savingUserResult.message,
        savingUserResult.error,
      );
    }
    const response: UpdateUserInfoResponseApplicationDto = {
      userId: param.userId,
      success: true,
    };
    return Result.success(response, 200);
  }
}
