import { UserStateType } from "../types/userStateType";
import ApiHelper from "../helpers/apiHelper";
import {UserType} from "../types/userType";

export default class User {
    private _id: number;
    private _username: string;

    constructor(userData: UserType = {id: 1, username: "username"}) {
        this._id = userData.id;
        this._username = userData.username;
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
