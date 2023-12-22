import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FindSongUrlService } from 'src/song/application/services/find-song-url.application.service';
import { SongRepository } from 'src/song/infraestructure/repositories/song.repository';
import { SendSongThroughtChunksInfrastructureService } from 'src/song/infraestructure/services/send-song-throught-chunks.infrastructure.service';
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
    const service = new FindSongUrlService(new SongRepository(this.dataSource));
    const url = await service.execute(payload);
    if (url.IsSuccess){
      SendSongThroughtChunksInfrastructureService.sendSong(client, url.Data.Id);
    }else{
      console.log(url.Error)
    }
  }

  



}
