import * as Phaser from "phaser";
import ChatFlow from "../../classes/chat/chatFlow";
import storyJson from "../../assets/story-new.json";
import { ChatFlowNode } from "../../classes/chat/chatFlowNode";
import { json } from "express";
import { gameController } from "../../main";
import ApiHelper from "../../helpers/apiHelper";

/**
 * Story manager, handles the story flow, loading from json, saving to game state,
 * reconstructing the chat flow tree from json, etc
 */
export default class StoryManager {
    private _storyEvents: { [room: string]: Map<string, ChatFlow> } = {}; // Stores ChatFlow objects for each room and event.

    public initialiseStoryEvents() {
        // Iterate over each 'room' in the 'storyJson' object.
        for (let room in storyJson) {
            // If the '_storyEvents' map does not have an entry for the current 'room',
            // create a new entry with an empty Map to store ChatFlow objects.
            if (!(room in this._storyEvents)) this._storyEvents[room] = new Map<string, ChatFlow>();

            // Iterate over each index 'i' in the 'storyJson[room]'. Those will be the main story lines.
            for (var i = 0; i < Object.keys(storyJson[room]).length; i++) {
                // for(let i of Object.keys(storyJson[room]))

                // If the current index 'i' is present in the '_finishedStuff[room]' array,
                // skip this iteration to avoid processing already encountered events.
                if (gameController.gameStateManager.story[room].includes(i.toString())) {
                    continue;
                }

                // If the 'i' key is present in the 'storyJson[room]', create a new ChatFlow object ('cf').
                // This involves reconstructing the ChatNode tree recursively for the specified 'room' and 'i'.
                if (i.toString() in storyJson[room]) {
                    let cf: ChatFlow = new ChatFlow(
                        this.reconstructChatNodeTreeRecursively(room, storyJson, i.toString()),
                    );

                    this._storyEvents[room].set(i.toString(), cf);
                } else break;
            }
        }
    }

    /**
     * Checks if a specific event is available in the given room.
     * @param {string} roomId - The ID of the room to check for the event.
     * @param {string} eventId - The ID of the event to check for availability.
     * @returns {boolean} True if the event is available, false otherwise.
     */
    public checkIfEventAvailable(roomId, eventId) {
        // Check if the provided 'eventId' is present in the '_finishedStuff[roomId]' array.
        // If it is present, the event is considered finished, and it is not available.
        if (gameController.gameStateManager.story[roomId].includes(eventId)) return false;
        // Check if the provided 'eventId' is a valid key in 'storyJson[roomId]'.
        // If it is a valid key, the event is available.
        return !!storyJson[roomId][eventId];
    }

    /**
     * Updates the _finishedStuff array with the provided eventId for the given roomId,
     * and returns a new ChatFlow object for the specified roomId and eventId.
     * @param {string} roomId - The ID of the room to update the finished events and get the ChatFlow.
     * @param {string} eventId - The ID of the event to update as finished and construct the ChatFlow.
     * @returns {ChatFlow} A new ChatFlow object for the specified roomId and eventId.
     */
    public pullEventIdChatFlow(roomId, eventId): ChatFlow {
        gameController.gameStateManager.story[roomId].push(eventId);
        return new ChatFlow(this.reconstructChatNodeTreeRecursively(roomId, storyJson, eventId));
    }

    /**
     * Recursively reconstructs a tree of ChatFlowNode objects based on JSON chat node data for a given room and nodeId.
     * @param {string} room - The ID of the room containing the chat node data.
     * @param {JSON} json - The JSON object containing chat node data for the given room.
     * @param {string} nodeId - The ID of the node for which to reconstruct the chat node tree.
     * @returns {ChatFlowNode} The root node of the reconstructed chat node tree.
     */
    public reconstructChatNodeTreeRecursively(room: string, json: JSON, nodeId: string) {
        // Create an empty Map to store choices and their respective child nodes.
        let choices = new Map();

        // Check if the "choices" key exists in the JSON data for the given room and nodeId.
        // If it exists, process each choice recursively to reconstruct the child nodes.
        if ("choices" in json[room][nodeId]) {
            json[room][nodeId]["choices"].forEach((c) => {
                let childNode: ChatFlowNode = this.reconstructChatNodeTreeRecursively(room, json, c);
                choices.set(childNode.optionText, childNode);
            });
        }

        // Create a new ChatFlowNode object for the current room and nodeId.
        // This node will include the optionText, text, and the choices Map created above.
        let newNode: ChatFlowNode = {
            optionText: json[room][nodeId]["optionText"],
            text: json[room][nodeId]["text"]
                .replace(/php/gi, gameController.gameStateManager.curriculum.progLang)
                .replace(/astronaut/gi, (match) => {
                    return match + " " + gameController.gameStateManager.user.username;
                }),
            choices: choices,
        };

        return newNode;
    }

    /**
     * Pulls the next story bit (ChatFlow) for the given room.
     * Retrieves the first ChatFlow in the _storyEvents map for the specified room.
     * Marks the retrieved ChatFlow as finished by adding the corresponding key to _finishedStuff array for the room.
     * Removes the ChatFlow from the _storyEvents map for the room.
     * @param {string} room - The ID of the room from which to pull the next story bit.
     * @returns {ChatFlow} The pulled ChatFlow representing the next story bit to be processed.
     */
    public pullNextStoryBit(room: string): ChatFlow {
        let key = this._storyEvents[room].keys().next().value;
        let newChatFlow: ChatFlow = this._storyEvents[room].get(key);
        gameController.gameStateManager.story[room].push(key);
        this._storyEvents[room].delete(key);

        return newChatFlow;
    }

    /**
     * Appends new text entries to the existing text history.
     * @param {string[][]} newTexts - An array of text entries to be added to the text history.
     */
    public addTextHistory(newTexts: string[][]) {
        gameController.gameStateManager.story.history = gameController.gameStateManager.story.history.concat(newTexts);
    }

    /**
     * Check if the entry story bit for a given room has been played.
     * @param roomId
     */
    public checkIfRoomStoryPlayed(roomId) {
        return gameController.gameStateManager.story[roomId].includes("0");
    }
}
