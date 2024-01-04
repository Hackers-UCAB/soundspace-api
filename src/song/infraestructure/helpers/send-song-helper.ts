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

    // async sendSong(client: Socket, blob:any, size:number, rate: number) {
    //     let sequence = 1;
    //     const bufferSize = size / 20;
    //     let buffer = Buffer.alloc(0);
        
    //     blob.on('data', (chunk) => {
          
    //         buffer = Buffer.concat([buffer, chunk]);
      
    //         if (buffer.length >= bufferSize) {
    //           client.emit('message-from-server', {
    //             secuencia: sequence,
    //             chunk: buffer,
    //           });
    //           sequence += 1;
    //           buffer = Buffer.alloc(0);
    //         }
          
    //     });
      
    //     blob.on('end', () => {
    //       client.emit('message-from-server', {
    //         secuencia: sequence,
    //         chunk: buffer,
    //       });
    //     });
    // }
  
    //! Este lo hace bien en todos los sentidos. Potencialmente la opcion final
    async sendSong(client: Socket, blob:any, size:number, rate: number, second: number) {
      let sequence = 1;
      const bufferSize = size / 40;
      let buffer = Buffer.alloc(0);
      let startTime=0;
      let endTime=0;
      let flag = false;
      blob.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
    
          if (buffer.length >= bufferSize) {
            endTime = startTime + (buffer.length/rate);
            if(((second >= startTime) && (second <= endTime )) || flag === true){
              flag=true
              client.emit('message-from-server', {
                secuencia: sequence,
                chunk: buffer,
                start: Math.trunc(startTime),
                end: Math.trunc(endTime)
              });
              sequence += 1;
              buffer = Buffer.alloc(0);
              startTime= endTime;
            }else{
              sequence += 1;
              buffer = Buffer.alloc(0);
              startTime= endTime;
            }
          }
        
      });
    
      blob.on('end', () => {
        client.emit('message-from-server', {
          secuencia: sequence,
          chunk: buffer,
          start: Math.trunc(startTime),
          end: Math.trunc(size/rate)
        });
      });
  }

    //!Aqui manda mal la secuencia pero el resto lo hace bien
//   async sendSong(client: Socket, blob:any, size:number, rate: number, second: number) {
//     let sequence = 1;
//     const bufferSize = size / 20;
//     let buffer = Buffer.alloc(0);
//     let startTime = 0;
//     let endTime = 0;

//     blob.on('data', (chunk) => {
//       if (startTime >= second) {
//         buffer = Buffer.concat([buffer, chunk]);
  
//         if (buffer.length >= bufferSize) {
//           endTime = startTime + (buffer.length / rate);
//           client.emit('message-from-server', {
//             secuencia: sequence,
//             chunk: buffer,
//             start: Math.trunc(startTime),
//             end: Math.trunc(endTime)
//           });
//           sequence += 1;
//           buffer = Buffer.alloc(0);
//           startTime = endTime;
//         }
//       } else {
//         startTime += chunk.length / rate;
//       }
//     });
  
//     blob.on('end', () => {
//       if (buffer.length > 0) {
//         client.emit('message-from-server', {
//           secuencia: sequence,
//           chunk: buffer,
//           start: Math.trunc(startTime),
//           end: Math.trunc(size / rate)
//         });
//       }
//     });
// }
}
