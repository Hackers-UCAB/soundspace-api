import {
  BlockBlobClient,
  BlobServiceClient,
  BlobDownloadResponseParsed,
} from '@azure/storage-blob';
import { Result } from 'src/common/domain/result-handler/result';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class AzureBufferImageHelper implements IGetBufferImageInterface {
  private async getBlobClient(
    fileName: string,
    container: string,
  ): Promise<Result<BlockBlobClient>> {
    let error: any;
    let blobClient: BlockBlobClient;
    try {
      const blobClientService = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
      );
      const containerClient = blobClientService.getContainerClient(container);
      blobClient = containerClient.getBlockBlobClient(fileName);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message || 'Ha ocurrido un error buscando la imagen',
          new Error(error.message || 'Ha ocurrido un error buscando la imagen'),
        );
      }
      if (!blobClient) {
        return Result.fail(
          null,
          404,
          'No existe ese file',
          new Error('No existe ese file'),
        );
      }
      return Result.success(blobClient, 200);
    }
  }

  private async streamToBuffer(readableStream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      readableStream.on('data', (data) => chunks.push(data));
      readableStream.on('end', () => resolve(Buffer.concat(chunks)));
      readableStream.on('error', reject);
    });
  }

  async getFile(fileName: string): Promise<Result<Buffer>> {
    //Busqueda de la imagen
    const blobClientResult: Result<BlockBlobClient> = await this.getBlobClient(
      fileName,
      process.env.IMAGES_CONTAINER,
    );

    if (!blobClientResult.IsSuccess) {
      return Result.fail(
        null,
        blobClientResult.statusCode || 500,
        blobClientResult.Error.message ||
          'Ha ocurrido un error buscando la imagen',
        blobClientResult.Error ||
          new Error('Ha ocurrido un error buscando la imagen'),
      );
    }

    //Descarga de la imagen
    let blobDownloaded: BlobDownloadResponseParsed;
    let errorDownloading: any;
    try {
      blobDownloaded = await blobClientResult.Data.download();
    } catch (err) {
      errorDownloading = err;
    } finally {
      if (errorDownloading || !blobDownloaded) {
        return Result.fail(
          null,
          500,
          'Ha ocurrido un error descargando la imagen',
          new Error('Ha ocurrido un error descargando la imagen'),
        );
      }
    }
    //Conversion de la imagen a Buffer
    let buffer: Buffer;
    let errorBuffering: any;
    try {
      buffer = await this.streamToBuffer(blobDownloaded.readableStreamBody);
    } catch (err) {
      errorBuffering = err;
    } finally {
      if (errorBuffering){
        return Result.fail(
          null,
          500,
          'Ha ocurrido un error convertiendo la imagen',
          new Error('Ha ocurrido un error convertiendo la imagen'),
        );
      }

      return Result.success(buffer, 200);
    }
  }
}
