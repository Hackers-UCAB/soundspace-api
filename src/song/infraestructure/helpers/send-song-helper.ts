import { Socket } from "socket.io";
import { ISendSongHelper } from "src/song/application/interfaces/send-song-helper.iterface";

export class SendSongHelper implements ISendSongHelper {
    
    // async sendSong( client: Socket, blob: any, size: number ) {

    //     let sequence = 1;
    //     const buffersize = size/20;
    //     let buffer = Buffer.alloc(0)
    //     blob.on('data', (chunk) => {
    //         buffer = Buffer.concat([buffer,chunk]);

    //         if (buffer.length >= buffersize){
    //             client.emit('message-from-server', {
    //                 secuencia: sequence ,
    //                 chunk: buffer
    //             } );
    //             sequence = sequence + 1
    //             buffer = Buffer.alloc(0)
    //         }
    //     })

    //     blob.on('end', () => {
    //         client.emit('message-from-server', {
    //             secuencia: sequence ,
    //             chunk: buffer
    //         } );
    //         })
    // }

    async sendSong(client: Socket, blob:any, size:number, second:number) {
        let sequence = 1;
        const bufferSize = size / 20;
        let buffer = Buffer.alloc(0);
        
        blob.on('data', (chunk) => {
          
            buffer = Buffer.concat([buffer, chunk]);
      
            if (buffer.length >= bufferSize) {
              client.emit('message-from-server', {
                secuencia: sequence,
                chunk: buffer,
              });
              sequence += 1;
              buffer = Buffer.alloc(0);
            }
          
        });
      
        blob.on('end', () => {
          client.emit('message-from-server', {
            secuencia: sequence,
            chunk: buffer,
          });
        });
    }
}
