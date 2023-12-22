import { Socket } from "socket.io";
import { getFile } from "../helpers/get-blob-file.helper";

export class SendSongThroughtChunksInfrastructureService {
    
    static async sendSong( client: Socket, url: string ) {
        const {blob, size} = await getFile(url+'.mp3', process.env.SONGS_CONTAINER);
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