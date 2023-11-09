import { string, z } from "zod";

export const getOneInputValidator = z.object({
    id: string().cuid()
});