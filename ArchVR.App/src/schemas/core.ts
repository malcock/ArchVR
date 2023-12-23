import { z } from "zod";

export const emailField = z.string().email();
