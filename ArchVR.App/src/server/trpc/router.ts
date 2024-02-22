import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { helloWorldRouter } from "./routers/helloWorld";
import { projectRouter } from "./routers/project";
import { sceneRouter } from "./routers/scene";
import { fileRouter } from "./routers/files";

export const appRouter = router({
  user: userRouter,
  helloWorld: helloWorldRouter,
  project: projectRouter,
  scene: sceneRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
