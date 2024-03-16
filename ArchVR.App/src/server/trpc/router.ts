import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { helloWorldRouter } from "./routers/helloWorld";
import { projectRouter } from "./routers/project";
import { sceneRouter } from "./routers/scene";
import { fileRouter } from "./routers/files";
import { deviceRouter } from "./routers/devices";
import { configRouter } from "./routers/config";

export const appRouter = router({
  user: userRouter,
  helloWorld: helloWorldRouter,
  project: projectRouter,
  scene: sceneRouter,
  file: fileRouter,
  device: deviceRouter,
  config: configRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
