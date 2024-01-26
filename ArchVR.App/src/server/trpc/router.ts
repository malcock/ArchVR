import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { helloWorldRouter } from "./routers/helloWorld";
import { projectRouter } from "./routers/project";

export const appRouter = router({
  user: userRouter,
  helloWorld: helloWorldRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
