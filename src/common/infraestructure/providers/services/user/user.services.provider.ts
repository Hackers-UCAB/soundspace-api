import { Provider } from "@nestjs/common";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { SecurityApplicationServiceDecorator } from "src/common/application/services/decorators/security-decorator/security-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { GetUserInfoApplicationService } from "src/user/application/services/get-user-info.application.service";
import { UpdateUserInfoApplicationService } from "src/user/application/services/update-user-info.application.service";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { UserRepository } from "src/user/infraestructure/repositories/user.repository";
import { DataSource } from "typeorm";

export const userServicesProviders: Provider[] = [
    {
        provide: 'GetUserInfoApplicationService',
        useFactory: (userRepository: IUserRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new SecurityApplicationServiceDecorator(
                new GetUserInfoApplicationService(userRepository),
                userRepository,
                [UserRoleEnum.USER],
              ),
              auditingRepository,
              'Get User Info',
              logger,
            ),
            logger,
            'Get User Info',
          );
        },
        inject: ['UserRepository', 'AuditingRepository', 'ILogger'],
      },
      {
        provide: 'UpdateUserInfoApplicationService',
        useFactory: (userRepository: IUserRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new SecurityApplicationServiceDecorator(
                new UpdateUserInfoApplicationService(
                  userRepository,
                ),
                userRepository,
                [UserRoleEnum.USER],
              ),
              auditingRepository,
              'Update User Info',
              logger,
            ),
            logger,
            'Update User Info',
          );
        },
        inject: ['UserRepository', 'AuditingRepository', 'ILogger'],
      },
]