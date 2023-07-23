import * as Phaser from "phaser";
import ChatFlow from "../../classes/chat/chatFlow";
import storyJson from "../../assets/story.json";
import { ChatFlowNode } from "../../classes/chat/chatFlowNode";
import { json } from "express";
import RootNode from "../../views/rootNode";

export default class StoryManager {
    private _storyEvents = {};
    private _rootNode : RootNode;

    private _finishedStuff = {
        hangar: [],
        commonRoom: [],
        engine: [],
        laboratory: [],
        bridge: []
    };

    constructor(rootNode: RootNode) {
        this._rootNode = rootNode;
        this.loadData();


        for(let room in storyJson) {
            if (!(room in this._storyEvents)) this._storyEvents[room] = new Map<string, ChatFlow>();
            
            for (var i = 0; i < Object.keys(storyJson[room]).length; i++) {
                if (this._finishedStuff[room].includes(i.toString())) {
                    continue;
                }

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
        console.log(this._storyEvents)
    }

    public checkIfEventAvailable(roomId, eventId) {
        if (this._finishedStuff[roomId].includes(eventId)) return false;
        if (storyJson[roomId][eventId]) return true;

        return false;
    }

    public pullEventIdChatFlow(roomId, eventId) {
        this._finishedStuff[roomId].push(eventId);
        return new ChatFlow(this.reconstructChatNodeTreeRecursively(roomId, storyJson, eventId));
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
            text: json[room][nodeId]["text"].replace("astronaut", "astronaut Peter").replace("Astronaut", "Astronaut Peter"),
            choices: choices
        }

        return newNode;
    }

    public pullNextStoryBit(room) {
        // TODO CONTINUE HERE

        let key = this._storyEvents[room].keys().next().value;
        let value = this._storyEvents[room].get(key);

        this._finishedStuff[room].push(key);
        this._storyEvents[room].delete(key);

        return value;
    }

    public loadData() {
        this._finishedStuff = this._rootNode.getState().story;
    }

    public saveAll() {
        return this._finishedStuff;
    }

    public checkIfRoomStoryPlayed(roomId) {
        return this._finishedStuff[roomId].includes("0");
    }
}