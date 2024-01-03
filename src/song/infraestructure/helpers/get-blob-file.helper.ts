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

  //!Este esta borrado XD
  //TODO: Debo buscar la manera de leer los segundos que me manden del front y convertirlos a bytes para poder pasarselo a la logica
  async getFile(fileName: string, container: string, startPointInSeconds: number, duration: number) {
    try {
      const blobClient = await this.getBlobClient(fileName, container);
      const metadata = await blobClient.getProperties()
      const rate = metadata.contentLength/duration
      const blobDownloaded = await blobClient.download()
      return {
        blob: blobDownloaded.readableStreamBody,
        size: metadata.contentLength,
        startByte: rate
      };
    } catch (error) {
      throw error;
    }
  }
}
