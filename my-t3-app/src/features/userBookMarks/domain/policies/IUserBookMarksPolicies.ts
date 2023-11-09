import type { User } from "next-auth";
import type { UserBookMark } from "../models/UserBookMark";
import type { IUserBookMarksRepository } from "../../repositories/IUserBookMarksRepository";

export interface IUserBookMarksPolicies {
    canCreate: (user: User, bookMarksRepository: IUserBookMarksRepository) => Promise<boolean>;
    canRead: (user: User, userBookMark: UserBookMark) => boolean;
    canUpdate: (user: User, userBookMark: UserBookMark) => boolean;
    canDelete: (user: User, userBookMark: UserBookMark) => boolean;
}