import {
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import { db } from "../utils/db";
import { File as DBFile, Prisma } from "@prisma/client";
import { Readable } from "stream";

class FileService {
  containerName = "uploads";

  create(name: string, id?: string, originalFilepath?: string) {
    return db.file.create({
      data: {
        name,
        id,
        originalFilepath,
      },
    });
  }

  update(fileId: string, data: Partial<DBFile>) {
    console.log(fileId, data);
    return db.file.update({
      where: {
        id: fileId,
      },
      data,
    });
  }

  grantOrgAccess(fileId: string, organisationId: string) {
    return db.organisationFiles.create({
      data: {
        fileId,
        organisationId,
      },
    });
  }

  removeOrgAccess(fileId: string, organisationId: string) {
    return db.organisationFiles.delete({
      where: {
        organisationId_fileId: {
          fileId,
          organisationId,
        },
      },
    });
  }

  async upload(blobName: string, file: File) {
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING as string,
      this.containerName,
      blobName
    );

    const stream = file.stream();
    const streamLength = file.size;

    const reader = stream.getReader();
    // Convert the Web API ReadableStream to a Node.js Readable stream
    const nodeReadableStream = new Readable({
      async read() {
        // Implement the _read method to push data from the Web API ReadableStream to the Node.js Readable stream
        const chunk = await reader.read(); // Adjust the buffer size as needed
        if (!chunk.done) {
          this.push(chunk.value);
        } else {
          this.push(null); // Signal the end of the stream
        }
      },
    });

    return blobService.uploadStream(
      nodeReadableStream,
      streamLength,
      undefined,
      {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
      }
    );
  }

  async getFile(id: string) {
    return db.file.findFirst({
      where: {
        id,
      },
    });
  }

  async getFileBlob(blobName: string) {
    // const blobService = new BlockBlobClient('',)
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING as string,
      this.containerName,
      blobName
    );
    // console.log(blobService.url);
    const props = await blobService.getProperties();

    return {
      contentType: props.contentType,
      buffer: await blobService.downloadToBuffer(),
    };

    // blobService.generateSasUrl({});
  }

  count(
    organisationId: string | undefined = undefined,
    name: string | undefined = undefined
  ) {
    return db.file.count({
      where: {
        ...(organisationId && {
          Organisations: {
            every: {
              organisationId,
            },
          },
        }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });
  }

  list(
    organisationId: string | undefined = undefined,
    name: string | undefined = undefined,
    take: number = 10,
    skip: number = 0,
    orderBy:
      | Prisma.Enumerable<Prisma.ProjectOrderByWithRelationInput>
      | undefined = undefined
  ) {
    return db.file.findMany({
      where: {
        ...(organisationId && {
          Organisations: {
            every: {
              organisationId,
            },
          },
        }),
      },
      take,
      skip,
      orderBy,
    });
  }
}

const fileService = new FileService();

export default fileService;
