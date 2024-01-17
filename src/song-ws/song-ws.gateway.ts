import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Result } from 'src/common/domain/result-handler/result';
import { AuditingServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { LoggerImpl } from 'src/common/infrastructure/logger/logger';
import { OrmAuditingRepository } from 'src/common/infrastructure/auditing/repositories/orm-repositories/orm-auditing.repository';
import { PlaySongEntryApplicationDto } from 'src/song/application/dto/entry/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from 'src/song/application/dto/response/play-song.response.application.dto';
import { PlaySongService} from 'src/song/application/services/play-song.application.service';
import { GetSongFromAzureHelper } from 'src/song/infrastructure/helpers/get-song-from-azure.helper';
import { SendSongHelper } from 'src/song/infrastructure/helpers/send-song.helper';
import { DataSource } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { OrmSongMapper } from '../song/infrastructure/mapper/orm-mapper/orm-song.mapper';
import { SongReferenceImplementationHelper } from 'src/song/infrastructure/helpers/song-reference.implementation.helper';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { OrmSongRepository } from 'src/song/infrastructure/repositories/orm-repositories/orm-song.repository';


@WebSocketGateway({ cors: true })
export class SongWsGateway implements OnGatewayConnection, OnGatewayDisconnect {   
  private currentSongIdMap = new Map<Socket, string>();

  @WebSocketServer() wss: Server;
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
    @Inject('DataSource')
    private readonly ormSongMapper: OrmSongMapper,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository
  ) {

  }

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
      client.data = payload.songId
      const token = client.handshake.auth.token
      const jwt = new JwtService()
      const decoded = jwt.verify(token, {secret: process.env.JWT_SECRET})
      const dto: PlaySongEntryApplicationDto = {
        ...payload,
        userId: decoded.id
      }

    const service = 
    new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new PlaySongService( 
          new GetSongFromAzureHelper(), 
          new SendSongHelper(), 
          client,
          new SongReferenceImplementationHelper(this.userRepository, new OrmSongRepository(this.dataSource,this.ormSongMapper))),
        new OrmAuditingRepository(this.dataSource),
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
