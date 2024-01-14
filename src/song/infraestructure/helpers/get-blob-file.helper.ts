import { BlockBlobClient, BlobServiceClient, BlobDownloadResponseParsed } from '@azure/storage-blob';
import axios from 'axios';
import { createReadStream } from 'fs';


export class AzureBlobHelper{

  async getBlobClient(fileName: string, container: string): Promise<BlockBlobClient> {
    try {
      const blobClientService = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
      );
      const containerClient = blobClientService.getContainerClient(container);
      const blobClient = containerClient.getBlockBlobClient(fileName);
      if (!blobClient) {
        throw new Error(`File con el name ${fileName} not found`);
      }
      return blobClient;
    } catch (error) {
      throw error;
    }
  }

//! Esta manda la cancion completa
  // async getFile(fileName: string, container: string) {
  //   try {
  //     fileName = `${fileName}.mp3`;
  //     const blobClient = await this.getBlobClient(fileName, container)
  //     const blobDownloaded = await blobClient.download();
  //     const size = blobDownloaded.contentLength;
  //     console.log(size)
  //     if (!blobDownloaded) {
  //       throw new Error(`El file ${fileName} no se pudo descargar`);
  //     }
  
  //     //logica de mandar en chunks
  //     return {
  //       blob: blobDownloaded.readableStreamBody,
  //       size: size
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //!Esta version antigua estaba cool pero la otra envia unicamente el valor que me pidan
  // async getFile(fileName: string, container: string, startPointInSeconds: number, duration: number) {
  //   try {
  //     const blobClient = await this.getBlobClient(fileName, container);
  //     const metadata = await blobClient.getProperties()
  //     const rate = metadata.contentLength/duration
  //     const blobDownloaded = await blobClient.download()
  //     return {
  //       blob: blobDownloaded.readableStreamBody,
  //       size: metadata.contentLength,
  //       startByte: rate
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //Esta version esta como mejor realmente, obtengo el valor desde el segundo que me piden hasta 5 segundos despues
  async getFile(fileName: string, container: string, startPointInSeconds: number, duration: number) {
    try {
      const blobClient = await this.getBlobClient(fileName, container);
      // const metadata = await blobClient.getProperties();
      // console.log(duration)
      // console.log(metadata.contentLength)
      const rate = 16.25;
      const startPointInBytes = startPointInSeconds * rate * 1000;
      console.log(startPointInBytes)
      console.log('Usando rate: ' + rate*207*1000)
      let bytesDuration = 0
      if (startPointInSeconds === 0){
        bytesDuration = rate * 1000
      }else{
        bytesDuration = 10 * rate * 1000
      }
      console.log(startPointInBytes)
      console.log('Bytes Duration: ' + bytesDuration)
      //Esta nueva version deberia devolver el blob entero desde el punto que me pidan y descargar solo 5 segundos
      const blobDownloaded = await blobClient.download( Math.round(startPointInBytes), Math.round(bytesDuration));
      return {
        blob: blobDownloaded.readableStreamBody
      };
    } catch (error) {
      throw error;
    }
  }

  // async getFile(fileName: string, container: string, startPointInSeconds: number, duration: number) {
  //   try {
  //     const blobClient = await this.getBlobClient(fileName, container);
  //     const metadata = await blobClient.getProperties();
  //     const url = await blobClient.url
  //     console.log(url)
  //     // const otherRate = metadata.contentLength/duration;
  //     // console.log(duration)
  //     // console.log(metadata.contentLength)
  //     // console.log(otherRate)
  //     const rate = 16.25;
  //     const startPointInBytes = startPointInSeconds * rate * 1000;
  //     // console.log(startPointInBytes)
  //     // console.log(otherRate*startPointInSeconds)
  //     // console.log('Usando rate: ' + rate*207*1000)
  //     // console.log('Usando otherRate: ' + otherRate*207)
  //     const bytesDuration = 10 * rate * 1000
  //     // console.log('Bytes Duration: ' + bytesDuration)
  //     //Esta nueva version deberia devolver el blob entero desde el punto que me pidan y descargar solo 5 segundos
  //     // const blobDownloaded = await blobClient.download( startPointInBytes, bytesDuration);

  //     const response = await axios.get(url,{
  //     responseType: 'stream',
  //     headers: {
  //       "Content-Type": "audio/mpeg",
  //       "Range": `bytes=${String(startPointInBytes)}-${String(metadata.contentLength)}`,
  //       Authorization: `SharedAccessSignature sp=r&st=2024-01-14T13:39:24Z&se=2024-01-14T21:39:24Z&sv=2022-11-02&sr=c&sig=AxVSi14dvmb1XOVg2KXYc94V3G1cQvG6RVAaZtaDukI%3D`

  //     }
  //   })
  //   console.log(startPointInBytes)
  //   console.log(metadata.contentLength)
  //   response
  //     return {
  //       blob: response
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
