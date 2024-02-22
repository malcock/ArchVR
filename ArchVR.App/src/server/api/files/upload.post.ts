import { BlobSASPermissions, BlockBlobClient } from "@azure/storage-blob";
import { H3Error } from "h3";
import { envConfig } from "~/envConfig";
import { getServerSession } from "#auth";
import { UserSession } from "~/services/auth.services";
import fileService from "~/services/file.service";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated!" };
  }
  try {
    const formData = await readMultipartFormData(event);

    if (formData) {
      const file = formData[0];

      const { organisationId } = session.user as UserSession;
      return fileService.upload(organisationId, file);
    }
  } catch (err) {
    if (err instanceof H3Error) {
      throw err;
    }
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: "An unknow error occurred",
    });
  }
});
