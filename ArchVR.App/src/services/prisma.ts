import { PrismaClient } from "@prisma/client";
import { envConfig } from "~/envConfig";
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
      envConfig.AZURE_STORAGE_CONNECTION_STRING as string
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

import chalk from "chalk";

const prismaLogger = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.log(chalk.magenta("[PRISMA]"), " - ", ...args);
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      envConfig.NODE_ENV === "development"
        ? [
            { emit: "event", level: "info" },
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "query" },
          ]
        : ["error"],
  }).$extends({
    result: {
      file: {
        thumbnail: {
          needs: {
            thumbnail: true,
          },
          compute(file) {
            return file.thumbnail
              ? azureBlobStorageService.getBlobSasUri("files", file.thumbnail)
              : null;
          },
        },
        processed: {
          needs: {
            processed: true,
          },
          compute(file) {
            return file.processed
              ? azureBlobStorageService.getBlobSasUri("files", file.processed)
              : null;
          },
        },
      },
    },
  });
