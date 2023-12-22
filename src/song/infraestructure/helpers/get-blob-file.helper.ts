import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';

const getBlobClient = async (
  fileName: string,
  container: string,
): Promise<BlockBlobClient> => {
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
};

export const getFile = async (fileName: string, container: string) => {
  try {
    
    const blobClient = await getBlobClient(fileName, container)
    const blobDownloaded = await blobClient.download();
    const size = blobDownloaded.contentLength;
    console.log(size)
    if (!blobDownloaded) {
      throw new Error(`El file ${fileName} no se pudo descargar`);
    }

    //logica de mandar en chunks
    return {
      blob: blobDownloaded.readableStreamBody,
      size: size
    }
  } catch (error) {
    throw error;
  }
};
