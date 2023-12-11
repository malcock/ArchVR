// import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { updateUser } from "~/services/users.services";

export const userRouter = router({
  getUsers: protectedProcedure.query(async (req) => {
    const users = await req.ctx.prisma.user.findMany();
    if (!users) {
      return {
        type: "error",
        error: new TRPCError({ message: "no users", code: "NOT_FOUND" }),
      } as const;
    }
    return {
      type: "ok",
      data: users,
    } as const;
  }),
  isAuthed: protectedProcedure.query(() => {
    return {
      type: "ok",
      data: "you are authed!",
    } as const;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      updateUser(input);
    }),
});
