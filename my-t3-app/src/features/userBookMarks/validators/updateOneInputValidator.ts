import { string, z } from "zod";

export const updateOneInputValidator = z.object({
    id: string().cuid(),
    name: string().min(1),
    url: string().min(1)
});

export type UpdateOneUserBookMarkInput = z.infer<typeof updateOneInputValidator>;