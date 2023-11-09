import { UserBookMark } from "../domain/models/UserBookMark";
import { type UserBookMarkPayload } from "../selectors/userBookMarkDetailsSelector";
import { type UserBookMarkDTO } from "../dtos/UserBookMarkDTO";
import { type UserBookMarkDetails } from "../validators/userBookMarkDetailsOutputValidator"

export class UserBookMarkDataTransferService {

    static userBookMarkPayloadToUserBookMarkDomainModel = (payload: UserBookMarkPayload): UserBookMark => {
        const results = new UserBookMark();

        results.id = payload.id;
        results.userId = payload.userId;
        results.name = payload.name;
        results.url = payload.url;

        return results;
    }

    static userBookMarkDomainModelToUserBookMarkDTO = (domainModel: UserBookMark): UserBookMarkDTO => {
        return {
            id: domainModel.id,
            userId: domainModel.userId,
            name: domainModel.name,
            url: domainModel.url
        };
    }

    static userBookMarkDTOtoRouterOutputModel = (dto: UserBookMarkDTO) : UserBookMarkDetails => {
        return {
            id: dto.id,
            name: dto.name,
            url: dto.url
        }
    }

}