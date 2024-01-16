import { Socket } from "socket.io";
import { ISendSongHelper } from "src/song/application/interfaces/send-song-helper.iterface";

export class SendSongHelper implements ISendSongHelper {
    
  async sendSong(client: Socket, blob:any) {
    let buffer = Buffer.alloc(0);
    let border = 0
    blob.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (border === 10) {
        client.emit('message-from-server', {
          chunk: buffer
        })
        border = 0
        buffer = Buffer.alloc(0);
      }else{
        border += 1
      }
    })

    blob.on('end', () => {
      client.emit('message-from-server', {
        chunk: buffer
      })
      buffer = Buffer.alloc(0);
      client.emit('message-from-server', {
        chunk: buffer
      })
    })
  }
}