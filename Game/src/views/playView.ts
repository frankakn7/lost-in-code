import * as Phaser from "phaser";
import RoomScene from "../rooms/room";

/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class PlayView extends Phaser.Scene {
    /**
     * The current room that the play view should show (and the player is in)
     */
    private currentRoom: RoomScene; 

    /**
     * Play View constructor
     * @param initialRoomKey the room scene that the play view should start with
     * @param settingsConfig the standard settingsConfig object used for all scenes
     */
    constructor(initialRoom: RoomScene, settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig){
        super(settingsConfig);
        this.currentRoom = initialRoom;
    }

    public getCurrentRoom(): RoomScene{
        return this.currentRoom;
    }

    /**
     * Switch the current room scene with the new room scene
     * @param newRoom the new room to be displayed
     */
    public switchCurrentRoom(newRoom: RoomScene){
        this.scene.stop(this.currentRoom).launch(newRoom);
        this.currentRoom = newRoom;
    }

    public create(){
        console.log("Launched");
        // Adds the scene and launches it... (if active is set to true on added scene it is launched directly)
        this.scene.add("currentRoom", this.currentRoom)
        this.scene.launch(this.currentRoom)
    }
}