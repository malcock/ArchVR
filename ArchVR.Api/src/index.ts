import "@bogeychan/elysia-polyfills/node/index.js";
import "./config";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

import projectController from "./controllers/project.controller";
import { jwt } from "@elysiajs/jwt";
import { jwtPlugin } from "./jwt";
import { JwtAuth, JwtAuthError } from "./middleware/JwtAuth";
import authController from "./controllers/auth.controller";

import organisationController from "./controllers/organisation.controller";
import sceneController from "./controllers/scene.controller";
import fileController from "./controllers/file.controller";
import { HttpException } from "./exceptions/HttpException";
import deviceController from "./controllers/device.controller";

const app = new Elysia()

  .error({
    JWT_AUTH_ERROR: JwtAuthError,

    HTTP_EXCEPTION: HttpException,
  })
  .onError(({ code, error, set }) => {
    console.log("!!!!ERROR!!!!");
    console.log({ error, code, stack: error.stack });
    if (code === "JWT_AUTH_ERROR") {
      set.status = 401;
      return error.message;
    }
    if (code === "HTTP_EXCEPTION") {
      set.status = error.status;
      return error.message;
    }
    // return new Response(error.message);
  })

  .use(
    swagger({
      documentation: {
        tags: [
          { name: "Auth" },
          { name: "Organisations" },
          { name: "Projects" },
          { name: "Scenes" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            apiKey: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
    })
  )

  .use(organisationController)
  .use(authController)
  .use(projectController)
  .use(sceneController)
  .use(fileController)
  .use(deviceController)
  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);

export type App = typeof app;
