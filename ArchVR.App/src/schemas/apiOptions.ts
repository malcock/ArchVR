import { z } from "zod";

export const searchOptionsSchema = z.object({
  term: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
});
