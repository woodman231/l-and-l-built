import type { PrismaClient } from "@prisma/client";
import type { UserBookMark } from "../domain/models/UserBookMark";
import type { IUserBookMarksRepository, CreateOneUserBookMarkInputParams, UpdateOneUserBookMarkInputParams, GetAllUserBookMarksByUserIdInputParams, GetOrDeleteOneUserBookMarkInputParams } from "./IUserBookMarksRepository";
import { userBookMarkDetailsSelector, type UserBookMarkPayload } from "../selectors/userBookMarkDetailsSelector";
import { UserBookMarkDataTransferService } from "../dataTransferServices/userBookMarksDataTransferService";

export class UserBookMarksRepository implements IUserBookMarksRepository {    
    prismaClient: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prismaClient = prismaClient;        
    }

    createOneUserBookMark = async (params: CreateOneUserBookMarkInputParams): Promise<UserBookMark> => {        

        const payload: UserBookMarkPayload = await this.prismaClient.userBookMark.create({
            data: {
                userId: params.userId,
                name: params.name,
                url: params.url
            },
            select: userBookMarkDetailsSelector
        })

        const results = UserBookMarkDataTransferService.userBookMarkPayloadToUserBookMarkDomainModel(payload);
        
        return results;
    };

    getOneUserBookMark = async (params: GetOrDeleteOneUserBookMarkInputParams): Promise<UserBookMark> => {
        const payload: UserBookMarkPayload | null = await this.prismaClient.userBookMark.findFirst({
            where: {
                id: params.id
            },
            select: userBookMarkDetailsSelector
        });

        if(payload === null) {
            throw new Error("Not Found");
        }

        const results = UserBookMarkDataTransferService.userBookMarkPayloadToUserBookMarkDomainModel(payload);

        return results;
    };

    updateOneUserBookMark = async (params: UpdateOneUserBookMarkInputParams) : Promise<UserBookMark> => {
        const payload: UserBookMarkPayload | null = await this.prismaClient.userBookMark.update({
            where: {
                id: params.id
            },
            data: {
                name: params.name,
                url: params.url
            },
            select: userBookMarkDetailsSelector
        });

        if(payload === null) {
            throw new Error("Not Found");
        }

        const results = UserBookMarkDataTransferService.userBookMarkPayloadToUserBookMarkDomainModel(payload);

        return results;
    };

    getAllUserBookMarksByUserId = async (params: GetAllUserBookMarksByUserIdInputParams) : Promise<UserBookMark[]> => {
        let results: UserBookMark[] = [];

        const payload: UserBookMarkPayload[] | null = await this.prismaClient.userBookMark.findMany({
            where: {
                userId: params.userId
            },
            select: userBookMarkDetailsSelector
        })

        if(payload === null) {
            return results;
        }

        results = payload.map((userBookMarkPayload: UserBookMarkPayload) => {
            return UserBookMarkDataTransferService.userBookMarkPayloadToUserBookMarkDomainModel(userBookMarkPayload);
        });

        return results;
    };

    getCountOfBookMarksByUserId = async (params: GetAllUserBookMarksByUserIdInputParams) : Promise<number> => {
        return this.prismaClient.userBookMark.count({
            where: {
                userId: params.userId
            }
        });
    };

    deleteOneUserBookMarkById = async (params: GetOrDeleteOneUserBookMarkInputParams) : Promise<void> => {
        await this.prismaClient.userBookMark.delete({where: {
            id: params.id
        }});
    };

}