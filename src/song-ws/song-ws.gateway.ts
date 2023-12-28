import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { LoggerImpl } from 'src/common/infraestructure/logger/logger';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { PlaySongService, responseSong } from 'src/song/application/services/play-song.application.service';
import { AzureBlobHelper } from 'src/song/infraestructure/helpers/get-blob-file.helper';
import { SendSongHelper } from 'src/song/infraestructure/helpers/send-song-helper';
import { SongRepository } from 'src/song/infraestructure/repositories/song.repository';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';


@WebSocketGateway({ cors: true })
export class SongWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
  ) {}
  
  handleConnection( client: Socket ) {
    // console.log('Cliente conectado', client.id);

    
    
  }

  handleDisconnect( client: Socket ) {

    // console.log('Cliente desconectado', client.id);
    
    
  }

  @SubscribeMessage('song')
  async handleSong( client: Socket, payload: string ) {
  
    //!Aqui no esta como lo tienen en el resto porque me da problemas las dependencias, aqui ajuro necesito un modulo
    const service = new LoggerApplicationServiceDecorator(
      new AuditingCommandServiceDecorator(
          new PlaySongService(
          new SongRepository(this.dataSource), 
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

    await service.execute(payload);
    return 'ok';
  }
}
