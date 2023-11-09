import { type UserBookMark } from "../domain/models/UserBookMark"

export interface CreateOneUserBookMarkInputParams {
    userId: string;
    name: string;
    url: string;
}

export interface UpdateOneUserBookMarkInputParams {
    id: string;
    userId: string;
    name: string;
    url: string;
}

export interface GetAllUserBookMarksByUserIdInputParams {
    userId: string;
}

export interface GetOrDeleteOneUserBookMarkInputParams {
    id: string;
}

export interface IUserBookMarksRepository {
    createOneUserBookMark: (params: CreateOneUserBookMarkInputParams) => Promise<UserBookMark>;
    getOneUserBookMark: (params: GetOrDeleteOneUserBookMarkInputParams) => Promise<UserBookMark>;
    updateOneUserBookMark: (params: UpdateOneUserBookMarkInputParams) => Promise<UserBookMark>;
    getAllUserBookMarksByUserId: (params: GetAllUserBookMarksByUserIdInputParams) => Promise<UserBookMark[]>;
    getCountOfBookMarksByUserId: (params: GetAllUserBookMarksByUserIdInputParams) => Promise<number>;
    deleteOneUserBookMarkById: (params: GetOrDeleteOneUserBookMarkInputParams) => Promise<void>;
}
