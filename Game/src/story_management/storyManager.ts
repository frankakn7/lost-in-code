import * as Phaser from "phaser";
import ChatFlow from "../views/chatView/chatFlow";
import storyJson from "../assets/story.json";
import { ChatFlowNode } from "../views/chatView/chatFlowNode";
import { json } from "express";

export default class StoryManager {
    private _storyEvents = {};

    constructor() {
        for(let room in storyJson) {
            if (!(room in this._storyEvents)) this._storyEvents[room] = [];
            
            for (var i = 0; i < Object.keys(storyJson[room]).length; i++) {
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

    public getNextStoryBit(room) {
        return this._storyEvents[room].shift();
    }
}