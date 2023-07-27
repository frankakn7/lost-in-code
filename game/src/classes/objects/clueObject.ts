import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../room";

export default class ClueObject extends InteractiveObject {
    private _eventId: string;

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, room, x, y, params, properties);

        properties.forEach(p => {
            if (p["name"] == "event_id") {
                this._eventId = p["value"];
            }
        })

        if (!room.getRootNode().getStoryManager().checkIfEventAvailable(this.room.getRoomId(), this._eventId)) {
            this.destroy();
        }
    }

    public interact() {
        if (!this.room.getRootNode().getStoryManager().checkIfEventAvailable(this.room.getRoomId(), this._eventId)) return;

        this.room.getRootNode().openEventChatView(this.room.getRoomId(), this._eventId);
        this.destroy();
    }
}