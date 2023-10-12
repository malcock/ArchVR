import "@bogeychan/elysia-polyfills/node/index.js";
import "./config";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

import projectController from "./controllers/project.controller";
import { jwt } from "@elysiajs/jwt";
import { jwtPlugin } from "./jwt";
import { JwtAuth, JwtAuthError } from "./middleware/JwtAuth";
import authController, { AuthError } from "./controllers/auth.controller";

import organisationController from "./controllers/organisation.controller";
import sceneController from "./controllers/scene.controller";

const app = new Elysia()

  .onError(({ code, error }) => {
    console.log({ error }, { code }, error.stack);
    return new Response(error.message);
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
          },
        },
      },
    })
  )
  .error({ JWT_AUTH_ERROR: JwtAuthError, AUTH_ERROR: AuthError })
  .onError((ctx) => {
    if (ctx.code === "JWT_AUTH_ERROR") {
      ctx.set.status = 401;
      return ctx.error.message;
    }
  })

  .use(organisationController)
  .use(authController)
  .use(projectController)
  .use(sceneController)
  // .get("/", () => ({ hello: "Node.js👋" }))

  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);

export type App = typeof app;
