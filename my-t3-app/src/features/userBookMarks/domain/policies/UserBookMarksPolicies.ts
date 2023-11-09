import { type User } from "next-auth";
import { type UserBookMark } from "../models/UserBookMark";
import { type IUserBookMarksPolicies } from "./IUserBookMarksPolicies";
import { type IUserBookMarksRepository } from "../../repositories/IUserBookMarksRepository";

const MAX_USER_BOOKMARKS = 100;

export class UserBookMarksPolicies implements IUserBookMarksPolicies {
    canCreate = async (user: User, bookMarksRepository: IUserBookMarksRepository): Promise<boolean> => {
        const currentCountOfBookMarks = await bookMarksRepository.getCountOfBookMarksByUserId({
            userId: user.id
        });

        return currentCountOfBookMarks < MAX_USER_BOOKMARKS;
    };

    canRead = (user: User, userBookMark: UserBookMark): boolean => {
        return user.id === userBookMark.userId;
    };

    canUpdate = (user: User, userBookMark: UserBookMark): boolean => {
        return user.id === userBookMark.userId;
    };

    canDelete = (user: User, userBookMark: UserBookMark): boolean => {
        return user.id === userBookMark.userId;
    };
}
