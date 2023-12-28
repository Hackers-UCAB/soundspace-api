import { Socket } from "socket.io";
import { ISendSongHelper } from "src/song/application/interfaces/send-song-helper.iterface";

export class SendSongHelper implements ISendSongHelper {
    
    async sendSong( client: Socket, url: string, blob: any, size: number ) {

        let sequence = 1;
        const buffersize = size/20;
        let buffer = Buffer.alloc(0)
        blob.on('data', (chunk) => {
            buffer = Buffer.concat([buffer,chunk]);

            if (buffer.length >= buffersize){
                client.emit('chunk', {
                    secuencia: sequence ,
                    chunk: buffer
                } );
                sequence = sequence + 1
                buffer = Buffer.alloc(0)
            }
        })

        blob.on('end', () => {
            client.emit('chunk', {
                secuencia: sequence ,
                chunk: buffer
            } );
            })
    }
}
    
