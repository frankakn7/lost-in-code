import * as Phaser from "phaser";
import ChatFlow from "../views/chatView/chatFlow";
import storyJson from "../assets/story.json";
import { ChatFlowNode } from "../views/chatView/chatFlowNode";
import { json } from "express";
import PlayView from "../views/playView";

export default class StoryManager {
    private _storyEvents = {};
    private _storyMap = new Map<string, ChatFlow>;
    private _playView : PlayView;

    private _finishedStuff = {
        hangar: [],
        commonRoom: [],
        engine: [],
        laboratory: [],
        bridge: []
    };

    constructor(playView: PlayView) {
        this._playView = playView;
        this.loadData();


        for(let room in storyJson) {
            if (!(room in this._storyEvents)) this._storyEvents[room] = [];
            
            for (var i = 0; i < Object.keys(storyJson[room]).length; i++) {
                if (this._finishedStuff[room].includes(i.toString())) continue;

                if (i.toString() in storyJson[room]) {
                    this._storyEvents[room].push(new ChatFlow(this.reconstructChatNodeTreeRecursively(
                        room,
                        storyJson,
                        i.toString()
                    )));
                }
                else break;
            }
        }
    }

    public reconstructChatNodeTreeRecursively(room : string, json : JSON, nodeId: string) {
        let choices = new Map();
        
        if ("choices" in json[room][nodeId]) {
            json[room][nodeId]["choices"].forEach(c => {
                let childNode : ChatFlowNode = this.reconstructChatNodeTreeRecursively(room, json, c);
                choices.set(childNode.optionText, childNode);
            });
        }

        let newNode : ChatFlowNode = {
            optionText: json[room][nodeId]["optionText"],
            text: json[room][nodeId]["text"],
            choices: choices
        }

        return newNode;
    }

    public getStoryEvents() {
        return this._storyEvents;
    }

    public pullNextStoryBit(room) {
        // TODO CONTINUE HERE
        // this._finishedStuff[room].push(this._storyEvents.);
        return this._storyEvents[room].shift();
    }

    public loadData() {
        console.log("here it goes")
        console.log(this._playView.getState().story)
        console.log(this._finishedStuff)
        this._finishedStuff = this._playView.getState().story;
    }

    public saveAll() {
        return this._finishedStuff;
    }
}