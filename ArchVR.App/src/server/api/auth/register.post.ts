import * as userService from "~/services/users.services";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event);
  console.log({ body });

  console.log("checking for user");

  const userExists = await userService.findUserByEmail(body.email);
  console.log({ userExists });
  if (userExists) {
    throw createError({
      statusCode: 403,
      statusMessage: "User already exists",
    });
  }
  console.log(body.email);

  userService.createUserByEmailAndPassword(body);

  setResponseStatus(event, 201);

  return { message: "User created" };
});
