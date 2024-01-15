import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/domain/result-handler/result';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { LoggerImpl } from 'src/common/infrastructure/logger/logger';
import { AuditingRepository } from 'src/common/infrastructure/auditing/repositories/auditing.repository';
import { PlaySongEntryApplicationDto } from 'src/song/application/dto/entrys/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from 'src/song/application/dto/responses/play-song.response.application.dto';
import { PlaySongService} from 'src/song/application/services/play-song.application.service';
import { AzureBlobHelper } from 'src/song/infrastructure/helpers/get-blob-file.helper';
import { SendSongHelper } from 'src/song/infrastructure/helpers/send-song-helper';
import { SongRepository } from 'src/song/infrastructure/repositories/song.repository';
import { DataSource } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { OrmSongMapper } from '../song/infrastructure/mapper/orm-song.mapper';
import { SongReferenceImplementationHelper } from 'src/song/infrastructure/helpers/song-reference.implementation.helper';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';


@WebSocketGateway({ cors: true })
export class SongWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
    @Inject('DataSource')
    private readonly ormSongMapper: OrmSongMapper,

    @Inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  handleConnection( client: Socket ) {
    // console.log('Cliente conectado', client.id);

    
    
  }

  handleDisconnect( client: Socket ) {

    // console.log('Cliente desconectado', client.id);
    
    
  }

  @SubscribeMessage('message-from-client')
  async handleSong( 
    client: Socket,
    payload: {preview: boolean, songId: string, second: number} 
    ) 
    {

      const token = client.handshake.auth.token
      const jwt = new JwtService()
      const decoded = jwt.verify(token, {secret: process.env.JWT_SECRET})
      const dto: PlaySongEntryApplicationDto = {
        ...payload,
        userId: decoded.id
      }
    const service = 
    new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new PlaySongService( 
          new AzureBlobHelper(), 
          new SendSongHelper(), 
          client,
          new SongReferenceImplementationHelper(this.userRepository, new SongRepository(this.dataSource,this.ormSongMapper))),
        new AuditingRepository(this.dataSource),
        'PlaySongService',
        new LoggerImpl()
      ),
      new LoggerImpl(),
      'PlaySongService',
    );
    
    //Aqui es un poco diferente porque donde devuelvo realmente es con los emits
    const serviceResult: Result<PlaySongResponseApplicationDto> = await service.execute(dto);
    return "ok"      
  }
}
