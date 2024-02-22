import { Prisma, type File as PrismaFile } from "@prisma/client";
import { type MultiPartData } from "h3";
import { randomUUID } from "crypto";
import { BlockBlobClient } from "@azure/storage-blob";
import { envConfig } from "~/envConfig";
import { prisma } from "./prisma";
import type { SearchOptions } from "./types/SearchOptions";
import PaginatedResponse from "./types/PaginatedResponse";
class FileService {
  async upload(organisationId: string, file: MultiPartData) {
    const id = randomUUID();
    const filepath = `${organisationId}/${id}/${file.filename}`;
    const blockBlobClient = new BlockBlobClient(
      envConfig.AZURE_STORAGE_CONNECTION_STRING,
      "files",
      filepath
    );

    return blockBlobClient
      .uploadData(file.data, {
        blobHTTPHeaders: { blobContentEncoding: file.type },
      })
      .then(
        (res) => {
          const getType = (filepath: string) => {
            const ext = filepath.split(".").pop();
            const fileTypes = {
              ifc: "mesh",
              glb: "mesh",
              gltf: "mesh",
              jpg: "image",
              jpeg: "image",
              png: "image",
              ktx2: "image",
            };
            return Object.keys(fileTypes).includes(ext as string)
              ? fileTypes[ext as keyof typeof fileTypes]
              : "unknown";
          };
          return prisma.file.create({
            data: {
              id,
              original: filepath,
              name: file.name as string,
              type: getType(filepath),
            },
          });
        },
        (err) => {
          console.log({ err });
          throw err;
        }
      );
  }

  get(id: string) {
    return prisma.file.findUnique({
      where: {
        id,
      },
    });
  }

  async list(
    searchOptions: SearchOptions<Omit<PrismaFile, "id" | "organisationId">> & {
      organisationId?: string;
    }
  ) {
    const { term, orderBy, sortDirection, take, skip, organisationId } =
      searchOptions;

    const whereClause: Prisma.FileWhereInput = {
      ...(organisationId && { organisationId }),
      ...(term && {
        name: {
          contains: term,
        },
      }),
    };

    const totalCount = await prisma.file.count({ where: whereClause });
    const items = await prisma.file.findMany({
      where: whereClause,
      orderBy: orderBy ? { [orderBy]: sortDirection || "asc" } : undefined,
      take: take || 10,
      skip: skip || 0,
    });

    const pageSize = take || 10;
    const page = Math.floor((skip as number) / pageSize) + 1;

    return new PaginatedResponse(items, pageSize, page, totalCount);
  }
}

export default new FileService();
