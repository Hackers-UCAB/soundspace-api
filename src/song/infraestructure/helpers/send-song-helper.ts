import axios, { AxiosResponse } from "axios";
import { Socket } from "socket.io";
import { ISendSongHelper } from "src/song/application/interfaces/send-song-helper.iterface";

//! Asi estaba antes, manda varios pedazos con varias secuencias
// export class SendSongHelper implements ISendSongHelper {
    
//     async sendSong(client: Socket, blob:any, size:number, rate: number, second: number, streaming: boolean) {
//       let sequence = 1;
//       const bufferSize = size / 20;
//       let buffer = Buffer.alloc(0);
//       let startTime=0;
//       let endTime=0;
//       let flag = false;
//       let firstchunksent:boolean = false;
//       blob.on('data', (chunk) => {
        
//         if (!streaming && firstchunksent) return
//         buffer = Buffer.concat([buffer, chunk]);
    
//           if (buffer.length >= bufferSize) {
//             endTime = startTime + (buffer.length/rate);
//             if(((second >= startTime) && (second <= endTime )) || flag === true){
//               flag=true
//               client.emit('message-from-server', {
//                 secuencia: sequence,
//                 chunk: buffer,
//                 start: (startTime),
//                 end: (endTime)
//               });
//               sequence += 1;
//               buffer = Buffer.alloc(0);
//               startTime= endTime;
//               firstchunksent = true
//             }else{
//               sequence += 1;
//               buffer = Buffer.alloc(0);
//               startTime= endTime;
//             }
//           }
        
//       });
     
//         blob.on('end', () => {
//           if (!streaming) return;
//           client.emit('message-from-server', {
//             secuencia: sequence,
//             chunk: buffer,
//             start: (startTime),
//             end: (size/rate)
//           });
//         })
//   }
// }

//!Ahora es tan sencillo como esto porque ya el manejo para enviar la cancion lo hago es cuando hago la descarga. Envia una sola
// export class SendSongHelper implements ISendSongHelper {
    
//   async sendSong(client: Socket, blob:any) {
//     let buffer = Buffer.alloc(0);
//     blob.on('data', (chunk) => {
//       buffer = Buffer.concat([buffer, chunk]);
//     })

//     blob.on('end', () => {
//       client.emit('message-from-server', {
//       chunk: buffer
//     })
//     })
//   }
// }

// export class SendSongHelper implements ISendSongHelper {
    
//   async sendSong(client: Socket, response:AxiosResponse<any, any>) {
//     let buffer = Buffer.alloc(0);
//     let num = 0
//     let border = 0
//     let first = true;

//     // const response = await axios.get('https://songsv1.blob.core.windows.net/cancion/judas128.mp3?sp=r&st=2024-01-14T02:42:31Z&se=2024-01-14T10:42:31Z&sv=2022-11-02&sr=b&sig=VrbOip5EP7RSVQjf2O%2BpWo7AAAL75rcyfWnuo%2BsWPlk%3D',{
//     //   responseType: 'stream',
//     //   headers: {
//     //     "Content-Type": "audio/mpeg",
//     //   }
//     // })

//     response.data.on('data', (chunk) => {
//       buffer = Buffer.concat([buffer, chunk]);
//       if (border === 10) {
//         client.emit('message-from-server', {
//           chunk: buffer
//         })
//         border = 0
//         num = num+1;
//         console.log(num)
//         buffer = Buffer.alloc(0);
//       }else{

//         border += 1
//       }
//       if (first) {
//         client.emit('message-from-server', {
//           chunk: chunk
//         })
//         first = false
//         buffer = Buffer.alloc(0);
//       }
//     })

//     response.data.on('end', () => {
//       client.emit('message-from-server', {
//         chunk: buffer
//       })
//     })


//   }
// }

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