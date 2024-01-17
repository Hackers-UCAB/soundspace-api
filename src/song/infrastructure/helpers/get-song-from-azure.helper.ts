import { BlockBlobClient, BlobServiceClient} from '@azure/storage-blob';
import { IGetSongHelper } from 'src/song/application/interfaces/blob-helper.interface';


export class GetSongFromAzureHelper implements IGetSongHelper {

  private async getBlobClient(fileName: string, container: string): Promise<BlockBlobClient> {
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

  async getFile(fileName: string, container: string, startPointInSeconds: number) {
    try {
      const blobClient = await this.getBlobClient(fileName, container);
      console.log('blobClient: ', blobClient);
      const rate = 16.25;
      const startPointInBytes = startPointInSeconds * rate * 1000;
      const blobDownloaded = await blobClient.download( Math.round(startPointInBytes));
      return {
        blob: blobDownloaded.readableStreamBody
      };
    } catch (error) {
      throw error;
    }
  }
}
