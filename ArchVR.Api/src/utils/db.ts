import { PrismaClient } from "@prisma/client";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  BlobServiceClient,
} from "@azure/storage-blob";

const getStorageSharedKeyCredential = () => {
  const connectionStringValues: Record<string, string> = {};
  const keyValuePairStrings = (
    process.env.AZURE_STORAGE_CONNECTION_STRING || ""
  ).split(";");
  Array.prototype.forEach.call(keyValuePairStrings, (keyValuePairString) => {
    const keyValuePair = keyValuePairString.split("=");
    const key = keyValuePair[0];
    const value = keyValuePair[1];
    connectionStringValues[key] = value;
  });
  return new StorageSharedKeyCredential(
    connectionStringValues.AccountName,
    connectionStringValues.AccountKey
  );
};

const azureBlobStorageService = {
  getBlobSasUri: (containerName: string, blobName: string) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING as string
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const sasOptions = {
      containerName: containerClient.containerName,
      blobName,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: BlobSASPermissions.parse("r"),
    };
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      getStorageSharedKeyCredential()
    ).toString();
    return `${blockBlobClient.url}?${sasToken}`;
  },
};

const db = new PrismaClient().$extends({
  result: {
    file: {
      sasUrl: {
        needs: {
          processedFilepath: true,
        },
        compute(file) {
          return file.processedFilepath
            ? azureBlobStorageService.getBlobSasUri(
                "processed",
                file.processedFilepath
              )
            : null;
        },
      },
    },
  },
});
export { db };
