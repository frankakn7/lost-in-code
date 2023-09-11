import { UserStateType } from "../types/userStateType";
import ApiHelper from "../helpers/apiHelper";

export default class User {
    private _id: number;
    private _username: string;

    constructor(id: number = 1, username: string = "username") {
        this._id = id;
        this._username = username;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}
