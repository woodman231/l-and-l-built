import { string, z } from "zod";

export const userBookMarkDetailsOutputValidator = z.object({
    id: string().cuid(),
    name: string().min(1),
    url: string().min(1)
});

export type UserBookMarkDetails = z.infer<typeof userBookMarkDetailsOutputValidator>;