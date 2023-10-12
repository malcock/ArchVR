import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "accessJwt",
      secret: process.env.JWT_ACCESS_SECRET as string,
      exp: "10m",
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: process.env.JWT_REFRESH_SECRET as string,
      exp: "7d",
    })
  );
