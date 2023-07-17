import * as Phaser from "phaser";
import ChatFlow from "../views/chatView/chatFlow";
import storyJson from "../assets/story.json";
import { ChatFlowNode } from "../views/chatView/chatFlowNode";
import { json } from "express";
import PlayView from "../views/playView";

export default class StoryManager {
    private _storyEvents = {};
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
            if (!(room in this._storyEvents)) this._storyEvents[room] = new Map<string, ChatFlow>();
            
            for (var i = 0; i < Object.keys(storyJson[room]).length; i++) {
                if (this._finishedStuff[room].includes(i.toString())) continue;

                if (i.toString() in storyJson[room]) {
                    let cf : ChatFlow = new ChatFlow(this.reconstructChatNodeTreeRecursively(
                            room,
                            storyJson,
                            i.toString()
                            ));

                    this._storyEvents[room].set(i.toString(), cf);
                    
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

    public pullNextStoryBit(room) {
        // TODO CONTINUE HERE
        // this._finishedStuff[room].push(this._storyEvents.);
        

        let key = this._storyEvents[room].keys().next().value;
        let value = this._storyEvents[room].get(key);
        this._storyEvents[room].delete(key)

        return value;
    }

    public loadData() {
        this._finishedStuff = this._playView.getState().story;
    }

    public saveAll() {
        return this._finishedStuff;
    }
}