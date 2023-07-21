import {UserStateType} from "../types/userStateType";
import ApiHelper from "../helpers/apiHelper";

export default class User {
    private _id: number;
    private _username: string;

    private _newChapter: boolean;
    private _chapterNumber: number;
    private _performanceIndex: number;
    private _answeredQuestionIds: number[];
    private _repairedObjectsThisChapter: number;
    private _selectedHat: string;
    private _unlockedHats: string[];

    constructor(id: number = 1, username: string = "username", userState: UserStateType = {
        newChapter: true,
        chapterNumber: 1,
        performanceIndex: 1,
        answeredQuestionIds: [],
        repairedObjectsThisChapter: 0,
        selectedHat: "None",
        unlockedHats: []
    }) {
        console.log(userState)
        this._id = id;
        this._username = username;
        this._newChapter = userState.newChapter;
        this._chapterNumber = userState.chapterNumber;
        this._performanceIndex = userState.performanceIndex;
        this._answeredQuestionIds = userState.answeredQuestionIds;
        this._repairedObjectsThisChapter = userState.repairedObjectsThisChapter;
        this._selectedHat = userState.selectedHat;
        this._unlockedHats = userState.unlockedHats;
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

    get newChapter(): boolean {
        return this._newChapter;
    }

    set newChapter(value: boolean) {
        this._newChapter = value;
    }

    get chapterNumber(): number {
        return this._chapterNumber;
    }

    public increaseChapterNumber() {
        this._chapterNumber ++;
    }

    get performanceIndex(): number {
        return this._performanceIndex;
    }

    set performanceIndex(value: number) {
        this._performanceIndex = value;
    }

    get answeredQuestionIds(): number[] {
        return this._answeredQuestionIds;
    }

    public addAnsweredQuestionIds(value: number) {
        this._answeredQuestionIds.push(value);
    }

    get repairedObjectsThisChapter(): number {
        return this._repairedObjectsThisChapter;
    }

    set repairedObjectsThisChapter(value: number) {
        this._repairedObjectsThisChapter = value;
    }

    public increaseRepairedObjectsThisChapter() {
        this._repairedObjectsThisChapter ++;
    }

    get selectedHat(): string {
        return this._selectedHat;
    }

    set selectedHat(value: string) {
        this._selectedHat = value;
    }

    get unlockedHats(): string[] {
        return this._unlockedHats;
    }

    public addUnlockedHats(value: string) {
        this._unlockedHats.push(value);
    }

    public saveState():UserStateType{
        let userState = {
            newChapter: this._newChapter,
            chapterNumber: this._chapterNumber,
            performanceIndex: this._performanceIndex,
            answeredQuestionIds: this._answeredQuestionIds,
            repairedObjectsThisChapter: this._repairedObjectsThisChapter,
            selectedHat: this._selectedHat,
            unlockedHats: this._unlockedHats
        }
        console.log("SAVING STATE")
        console.log(userState)
        return userState
    }
}
