import { Socket } from "socket.io";
import { ISendSongHelper } from "src/song/application/interfaces/send-song-helper.iterface";

export class SendSongHelper implements ISendSongHelper {
    
    async sendSong(client: Socket, blob:any, size:number, rate: number, second: number, streaming: boolean) {
      let sequence = 1;
      const bufferSize = size / 20;
      let buffer = Buffer.alloc(0);
      let startTime=0;
      let endTime=0;
      let flag = false;
      let firstchunksent:boolean = false;
      blob.on('data', (chunk) => {
        
        if (!streaming && firstchunksent) return
        buffer = Buffer.concat([buffer, chunk]);
    
          if (buffer.length >= bufferSize) {
            endTime = startTime + (buffer.length/rate);
            if(((second >= startTime) && (second <= endTime )) || flag === true){
              flag=true
              client.emit('message-from-server', {
                secuencia: sequence,
                chunk: buffer,
                start: (startTime),
                end: (endTime)
              });
              sequence += 1;
              buffer = Buffer.alloc(0);
              startTime= endTime;
              firstchunksent = true
            }else{
              sequence += 1;
              buffer = Buffer.alloc(0);
              startTime= endTime;
            }
          }
        
      });
     
        blob.on('end', () => {
          if (!streaming) return;
          client.emit('message-from-server', {
            secuencia: sequence,
            chunk: buffer,
            start: (startTime),
            end: (size/rate)
          });
        })
  }
}
