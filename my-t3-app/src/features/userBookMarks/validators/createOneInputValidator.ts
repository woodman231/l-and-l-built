import { string, z } from "zod";

export const createOneInputValidator = z.object({
    name: string().min(1),
    url: string().min(1)
});

export type CreateOneUserBookMarkInput = z.infer<typeof createOneInputValidator>;