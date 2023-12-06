import { Elysia, t } from "elysia";
import { JwtAuth } from "../middleware/JwtAuth";
import fileService from "../services/file.service";
import { v4 as uuidv4 } from "uuid";
import PaginatedResponse from "../types/PaginatedResponse";
import { HttpException } from "../exceptions/HttpException";

const getBlobName = (fileId: string, originalName: string) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${fileId}/${identifier}-${originalName}`;
};

export default (app: Elysia) =>
  app
    .use(
      JwtAuth({
        exclude: ["/files/**/processed"],
      })
    )
    .post(
      "/files",
      async ({ body: { file }, set, auth: { organisationId } }) => {
        const id = uuidv4();

        const blobName = getBlobName(id, file.name);

        await fileService.upload(blobName, file);
        const f = await fileService.create(file.name, id, blobName);
        //grant access to the users current org
        await fileService.grantOrgAccess(f.id, organisationId);
        set.status = 201;
        return f;
      },
      {
        body: t.Object({
          file: t.File(),
        }),
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Files"],
        },
      }
    )
    .get(
      "/files",
      async ({ query, auth }) => {
        const { searchTerm, take = 10, skip = 0, sort, order } = query;
        const { organisationId } = auth;
        let orderBy: Record<string, string> = {};
        if (sort) {
          orderBy = {};
          orderBy[sort as string] = order || "asc";
        }
        const pageSize = Number(take as string);
        const page = 1 + Number(skip) / pageSize;

        const files = await fileService.list(
          organisationId as string,
          searchTerm as string,
          pageSize,
          Number(skip as string),
          orderBy
        );
        const total = await fileService.count(
          organisationId as string,
          searchTerm as string
        );
        type FileOb = (typeof files)[0];
        const response = new PaginatedResponse<FileOb>(
          files,
          pageSize,
          page,
          total
        );
        return response;
      },
      {
        query: t.Object({
          searchTerm: t.Optional(t.String()),
          take: t.Optional(t.String({ default: 10 })),
          skip: t.Optional(t.String({ default: 0 })),
          sort: t.Optional(t.Any()),
          order: t.Optional(t.Any()),
        }),
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Files"],
        },
      }
    )
    .get(
      "/files/:fileId",
      async ({ params: { fileId }, set }) => {
        // maybbe this is all dumb and we should redirect to SaS url
        set.redirect = `/files/${fileId}/final`;
      },
      {
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Files"],
        },
      }
    )
    .get(
      "/files/:fileId/:mode",
      async ({ params: { fileId, mode }, set }) => {
        let fileType = "processedFilepath";
        if (mode === "thumb") {
          fileType = "thumbFilepath";
        } else if (mode === "original") {
          fileType = "originalFilepath";
        } else {
          fileType = "processedFilepath";
        }
        // console.log({ fileId });
        const file = await fileService.getFile(fileId);
        // console.log({ file });
        //@ts-ignore
        if (!file[fileType]) throw new HttpException(404, "File ID not found");

        //@ts-ignore
        const blob = await fileService.getFileBlob(file[fileType]);
        set.headers["content-type"] = blob.contentType as string;
        const b = new Blob([blob.buffer], {
          type: blob.contentType as string,
        });

        return b;
      },
      {
        detail: {
          security: [{ bearerAuth: [] }],
          tags: ["Files"],
        },
      }
    )
    .put(
      "/files/:fileId/processed",
      async ({ request, body, params: { fileId } }) => {
        //manual check for azure function api key
        const authorization = request.headers.get("authorization");

        if (!authorization) {
          throw new HttpException(401, "🚫 Un-Authorized 🚫");
        }
        const key = authorization.split(" ")[1];
        if (key !== process.env.FUNCTION_API_KEY) {
          throw new HttpException(401, "🚫 Un-Authorized 🚫");
        }

        console.log("file.controller.setProcessedUrl", body);
        await fileService.update(fileId, body as any);
        return { success: true };
      },
      {
        detail: {
          security: [{ apiKey: [] }],
          tags: ["Files"],
        },
      }
    );
