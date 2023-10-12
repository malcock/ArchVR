import {
  BlockBlobClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import internal from "stream";
import getStream from "into-stream";
import { db } from "../utils/db";
import { File } from "@prisma/client";

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

  update(fileId: string, data: Partial<File>) {
    console.log(fileId, data);
    return db.file.update({
      where: {
        id: fileId,
      },
      data,
    });
  }

  upload(blobName: string, file: Express.Multer.File) {
    const blobService = new BlockBlobClient(
      process.env.AZURE_STORAGE_CONNECTION_STRING as string,
      this.containerName,
      blobName
    );

    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    return blobService.uploadStream(stream, streamLength, undefined, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });
  }

  async getFile(id: string) {
    return db.file.findFirstOrThrow({
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
      buffer: blobService.downloadToBuffer(),
    };

    // blobService.generateSasUrl({});
  }
}

const fileService = new FileService();

export default fileService;
