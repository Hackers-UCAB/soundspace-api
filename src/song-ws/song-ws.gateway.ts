import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/application/result-handler/result';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { LoggerImpl } from 'src/common/infraestructure/logger/logger';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { PlaySongEntryApplicationDto } from 'src/song/application/dto/entrys/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from 'src/song/application/dto/responses/play-song.response.application.dto';
import { PlaySongService} from 'src/song/application/services/play-song.application.service';
import { AzureBlobHelper } from 'src/song/infraestructure/helpers/get-blob-file.helper';
import { SendSongHelper } from 'src/song/infraestructure/helpers/send-song-helper';
import { SongRepository } from 'src/song/infraestructure/repositories/song.repository';
import { DataSource } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { OrmSongMapper } from '../song/infraestructure/mapper/orm-song.mapper';


@WebSocketGateway({ cors: true })
export class SongWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
    @Inject('DataSource')
    private readonly ormSongMapper: OrmSongMapper,
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
          new SongRepository(this.dataSource,this.ormSongMapper), 
          new UuidGenerator(), 
          new AzureBlobHelper(), 
          new SendSongHelper(), 
          client),
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
