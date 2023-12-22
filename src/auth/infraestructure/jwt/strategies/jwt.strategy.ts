import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { Inject } from '@nestjs/common';
import { Result } from 'src/common/application/result-handler/result';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user: Result<User> = await this.userRepository.findUserById(UserId.create(id));

    if (!user.IsSuccess) {
      HttpResponseHandler.HandleException(user.StatusCode, user.message, user.error);
    }
    return user.Data;
  }
}
