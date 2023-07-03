import * as Phaser from "phaser";
import RoomScene from "../rooms/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView";


/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class PlayView extends Phaser.Scene {
    /**
     * The current room that the play view should show (and the player is in)
     */
    private currentRoom: RoomScene; 
    /**
     * The ui control pad for controlling the player
     */
    private controlPad = new ControlPadScene();

    private pauseChatButtons = new PauseChatButtons();

    private chatView = new ChatView();
    private chatViewOpen = false;
    
    private openChatView(){
        this.scene.sleep();
        this.scene.sleep("controlPad")
        this.scene.sleep("room")
        this.scene.launch(this.chatView)
        this.chatViewOpen = true
    }

    public preload() {
        
    }

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
        // Adds the controlpad scene and launches it
        // this.scene.add("controlPad", this.controlPad)
        
        // TODO Check if mobile
        // this.scene.launch(this.controlPad)
        // this.add.existing(this.player);

        this.scene.add("pauseChatButtons", this.pauseChatButtons)
        this.scene.launch(this.pauseChatButtons)

        this.scene.add("controlPad", this.controlPad);
        this.scene.launch(this.controlPad);

        this.scene.add("chatView", this.chatView)
    }

    //for testing purposes
    public update(time: number, delta: number): void {
        
        if(this.currentRoom.player){
            this.currentRoom.player.leftPress = this.controlPad.leftPress
            this.currentRoom.player.rightPress = this.controlPad.rightPress
            this.currentRoom.player.upPress = this.controlPad.upPress
            this.currentRoom.player.downPress = this.controlPad.downPress
            this.currentRoom.player.interactPress = this.controlPad.interactPress
        }
        // if(this.controlPad.leftPress){
        //     // console.log("left")
        // }
        // if(this.controlPad.rightPress){
        //     console.log("right")
        //     this.currentRoom.player.rightPress = true
        // }
        // if(this.controlPad.upPress){
        //     console.log("up")
        //     this.currentRoom.player.upPress = true
        // }
        // if(this.controlPad.downPress){
        //     console.log("down")
        //     this.currentRoom.player.downPress
        // }
        // if(this.controlPad.interactPress){
        //     console.log("interact")
        // }
        if(this.pauseChatButtons.phonePressed && !this.chatViewOpen){
            this.openChatView();
        }
    }
}