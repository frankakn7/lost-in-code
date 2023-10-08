import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../room";
import {gameController} from "../../main";

export default class ClueObject extends InteractiveObject {
    private _eventId: string;

    constructor(
        id: number,
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(id, scene, room, x, y, params);

        properties.forEach(p => {
            if (p["name"] == "event_id") {
                this._eventId = p["value"];
            }
        })

        if (!gameController.storyManager.checkIfEventAvailable(this.room.roomId, this._eventId)) {
            this.destroy();
        }
    }

    public interact() {
        if (!gameController.storyManager.checkIfEventAvailable(this.room.roomId, this._eventId)) return;

        gameController.chatSceneController.openEventChatView(this.room.roomId, this._eventId);
        this.destroy();
    }
}