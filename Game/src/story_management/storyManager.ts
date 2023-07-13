import * as Phaser from "phaser";
import ChatFlow from "../views/chatView/chatFlow";
import storyJson from "./storyFormatExample.json";

export default class StoryManager {
    private _storyEvents : Array<ChatFlow>;

    constructor() {

    }

    public getNextStoryBit() {
        return this._storyEvents.pop();
    }
}