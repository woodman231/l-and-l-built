import { type IUserBookMark } from "./IUserBookMark";

export class UserBookMark implements IUserBookMark {

    id: string;
    userId: string;
    name: string;
    url: string;

    constructor() {
        this.id = "";
        this.userId = "";
        this.name = "";
        this.url = "";
    }
}
