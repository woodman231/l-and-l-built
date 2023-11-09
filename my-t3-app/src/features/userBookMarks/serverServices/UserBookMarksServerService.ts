import type { UserBookMarkDTO } from "../dtos/UserBookMarkDTO";
import type { CreateOneUserBookMarkInputArgs, GetAllUserBookMarksByUserIdInputParams, GetOrDeleteOneUserBookMarkInputParams, UpdateOneUserBookMarkInputParams, IUserBookMarksServerService } from "./IUserBookMarksServerService";
import type { IUserBookMarksRepository } from "../repositories/IUserBookMarksRepository";
import type { IUserBookMarksPolicies } from "../domain/policies/IUserBookMarksPolicies";
import { UserBookMarkDataTransferService } from "../dataTransferServices/userBookMarksDataTransferService"

export class UserBookMarksServerService implements IUserBookMarksServerService {

    _userBookMarksRepository: IUserBookMarksRepository;
    _userBookMarksPolicies: IUserBookMarksPolicies;

    constructor(userBookMarksRepository: IUserBookMarksRepository, userBookMarksPolicies: IUserBookMarksPolicies) {
        this._userBookMarksRepository = userBookMarksRepository;
        this._userBookMarksPolicies = userBookMarksPolicies;
    }

    createOne = async (params: CreateOneUserBookMarkInputArgs): Promise<UserBookMarkDTO> => {
        if (await this._userBookMarksPolicies.canCreate(params.user, this._userBookMarksRepository)) {
            const domainModel = await this._userBookMarksRepository.createOneUserBookMark({
                ...params.data
            });

            const dto = UserBookMarkDataTransferService.userBookMarkDomainModelToUserBookMarkDTO(domainModel);

            return dto;
        } else {
            throw new Error("Cannot Create")
        }
    };

    getOneById = async (params: GetOrDeleteOneUserBookMarkInputParams): Promise<UserBookMarkDTO> => {
        const domainModel = await this._userBookMarksRepository.getOneUserBookMark({
            id: params.data.id
        });

        if (this._userBookMarksPolicies.canRead(params.user, domainModel)) {
            const dto = UserBookMarkDataTransferService.userBookMarkDomainModelToUserBookMarkDTO(domainModel);

            return dto;
        } else {
            throw new Error("Cannot Read");
        }
    };

    updateOne = async (params: UpdateOneUserBookMarkInputParams) : Promise<UserBookMarkDTO> => {
        const currentDomainModel = await this._userBookMarksRepository.getOneUserBookMark({
            id: params.data.id
        });

        if(this._userBookMarksPolicies.canUpdate(params.user, currentDomainModel)) {
            const updatedDomainModel = await this._userBookMarksRepository.updateOneUserBookMark({
                ...params.data
            });

            const dto = UserBookMarkDataTransferService.userBookMarkDomainModelToUserBookMarkDTO(updatedDomainModel);

            return dto;
        } else {
            throw new Error("Cannot Update");
        }
    };

    getAllByUserId = async (params: GetAllUserBookMarksByUserIdInputParams) : Promise<UserBookMarkDTO[]> => {
        const domainModels = await this._userBookMarksRepository.getAllUserBookMarksByUserId({
            userId: params.user.id
        });

        const dtos = domainModels.map((domainModel) => {
            return UserBookMarkDataTransferService.userBookMarkDomainModelToUserBookMarkDTO(domainModel);
        })

        return dtos;

    };

    deleteOne = async (params: GetOrDeleteOneUserBookMarkInputParams) : Promise<void> => {
        const currentDomainModel = await this._userBookMarksRepository.getOneUserBookMark({
            id: params.data.id
        });

        if(this._userBookMarksPolicies.canDelete(params.user, currentDomainModel)) {
            await this._userBookMarksRepository.deleteOneUserBookMarkById({
                id: params.data.id
            });
        }
    };

}