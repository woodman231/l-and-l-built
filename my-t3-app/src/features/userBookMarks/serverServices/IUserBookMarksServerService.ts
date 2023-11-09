import { type User } from "next-auth";
import { type UserBookMarkDTO } from "../dtos/UserBookMarkDTO";

export interface CreateOneUserBookMarkInputArgs {
    user: User,
    data: {
        userId: string;
        name: string;
        url: string;
    }
}

export interface UpdateOneUserBookMarkInputParams {
    user: User,
    data: {
        id: string;
        userId: string;
        name: string;
        url: string;
    }
}

export interface GetAllUserBookMarksByUserIdInputParams {
    user: User,
}

export interface GetOrDeleteOneUserBookMarkInputParams {
    user: User,
    data: {
        id: string;
    }
}

export interface IUserBookMarksServerService {
    createOne: (params: CreateOneUserBookMarkInputArgs) => Promise<UserBookMarkDTO>;
    getOneById: (params: GetOrDeleteOneUserBookMarkInputParams) => Promise<UserBookMarkDTO>;
    updateOne: (params: UpdateOneUserBookMarkInputParams) => Promise<UserBookMarkDTO>;
    getAllByUserId: (params: GetAllUserBookMarksByUserIdInputParams) => Promise<UserBookMarkDTO[]>;
    deleteOne: (params: GetOrDeleteOneUserBookMarkInputParams) => Promise<void>;
}
