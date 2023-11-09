import { type Prisma } from "@prisma/client";

export const userBookMarkDetailsSelector = {
    id: true,
    userId: true,
    name: true,
    url: true
} satisfies Prisma.UserBookMarkSelect;

export type UserBookMarkPayload = Prisma.UserBookMarkGetPayload<{select: typeof userBookMarkDetailsSelector}>
