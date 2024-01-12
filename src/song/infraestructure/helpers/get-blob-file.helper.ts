import { BlockBlobClient, BlobServiceClient, BlobDownloadResponseParsed } from '@azure/storage-blob';
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
      const metadata = await blobClient.getProperties()
      const rate = metadata.contentLength/duration
      //Esta nueva version deberia devolver el blob entero desde el punto que me pidan y descargar solo 5 segundos
      const blobDownloaded = await blobClient.download(Math.trunc(startPointInSeconds * rate), Math.trunc(rate * 5));
      const buffer = await streamToBuffer(blobDownloaded.readableStreamBody);
      console.log(metadata.contentLength)
      return {
        blob: buffer
      };
    } catch (error) {
      throw error;
    }
  }
}

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error) => reject(error));
  });
};
