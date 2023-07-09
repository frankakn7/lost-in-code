import * as Phaser from "phaser";
import RoomScene from "../rooms/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView/chatView";
import { ChatFlowNode } from "./chatView/chatFlowNode";
import ChatFlow from "./chatView/chatFlow";
import QuestionView from "./questionView/questionView";
import TaskManager from "./questionView/taskManager";

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

    /**
     * The pause and chat buttons at the top of the screen
     */
    private pauseChatButtons = new PauseChatButtons();

    /**
     * the chat view
     */
    private chatView: ChatView;

    private questionView: QuestionView;

    /**
     * Opens the chat view by sending all other scenes to sleep and launching / awaking the chat view scene
     */
    private openChatView(): void {
        // Creating chat flow nodes for testing purposes
        const endNode: ChatFlowNode = {
            optionText: "Copy That, see you next time.",
            text: "...<Communications Relay Deactivated>...",
            choices: new Map(),
        };

        const node2: ChatFlowNode = {
            optionText: "Copy mission control!",
            text: "Good to hear from you! Sadly we have to end the communication here",
            choices: new Map([[endNode.optionText, endNode]]),
        };

        const node3: ChatFlowNode = {
            optionText: "I cant copy!",
            text: "This is no time for jokes Astronaut! We are gonna reach out again soon",
            choices: new Map([[endNode.optionText, endNode]]),
        };

        const node1: ChatFlowNode = {
            optionText: "Start the chat",
            text: "This is mission control do you copy?",
            choices: new Map([
                [node2.optionText, node2],
                [node3.optionText, node3],
            ]),
        };

        const endNode2: ChatFlowNode = {
            optionText: "> ./Deactivate 'Communications Relay'",
            text: "...<Communications Relay Deactivated>...",
            choices: new Map(),
        };

        const node22: ChatFlowNode = {
            optionText: "Can you read me?",
            text: "...",
            choices: new Map([[endNode2.optionText, endNode2]]),
        };
        const node21: ChatFlowNode = {
            optionText: "What is happening mission control?",
            text: "...",
            choices: new Map([[endNode2.optionText, endNode2]]),
        };

        const node32: ChatFlowNode = {
            optionText: "Hello?",
            text: "Hello? Hello Hello? Astronaut? Do you read me? Please respond...",
            choices: new Map([
                [node22.optionText, node22],
                [node21.optionText, node21],
            ]),
        };

        const node12: ChatFlowNode = {
            optionText: "Start the chat",
            text: "...<Communications Relay Activated>...",
            choices: new Map([[node32.optionText, node32]]),
        };

        const chatFlow = new ChatFlow(node1);
        const chatFlow2 = new ChatFlow(node12);

        //Send all scenes to sleep
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");

        //If the chat view already exists and is sleeping
        if (this.scene.isSleeping(this.chatView)) {
            //start a new chat flow and awake the scene
            this.chatView.startNewChatFlow(chatFlow2);
            this.scene.wake(this.chatView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.chatView = new ChatView(chatFlow);
            //add chat view to the scene
            this.scene.add("chatView", this.chatView);
            //launch the chat view
            this.scene.launch(this.chatView);
        }
    }

    private openQuestionView(){
        //If the chat view already exists and is sleeping
        if (this.scene.isSleeping(this.questionView)) {
            this.scene.wake(this.questionView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.questionView = new QuestionView(new TaskManager([]));
            //add chat view to the scene
            this.scene.add("questionView", this.questionView);
            //launch the chat view
            this.scene.launch(this.questionView);
        }
    }

    public preload() {}

    /**
     * Play View constructor
     * @param initialRoomKey the room scene that the play view should start with
     * @param settingsConfig the standard settingsConfig object used for all scenes
     */
    constructor(
        initialRoom: RoomScene,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);
        this.currentRoom = initialRoom;
    }

    /**
     * Get the currently displayed room
     * @returns the {@link currentRoom}
     */
    public getCurrentRoom(): RoomScene {
        return this.currentRoom;
    }

    /**
     * Switch the current room scene with the new room scene
     * @param newRoom the new room to be displayed
     */
    public switchCurrentRoom(newRoom: RoomScene) {
        this.scene.stop(this.currentRoom).launch(newRoom);
        this.currentRoom = newRoom;
    }

    public create() {
        console.log("Launched");

        // Adds the scene and launches it... (if active is set to true on added scene it is launched directly)
        this.scene.add("currentRoom", this.currentRoom);
        this.scene.launch(this.currentRoom);

        // TODO: Check if mobile

        //Adds the pause and phone buttons scene and launches it
        this.scene.add("pauseChatButtons", this.pauseChatButtons);
        this.scene.launch(this.pauseChatButtons);

        // Adds the controlpad scene and launches it
        this.scene.add("controlPad", this.controlPad);
        this.scene.launch(this.controlPad);
    }

    //for testing purposes
    public update(time: number, delta: number): void {
        //TODO: Optimize the player control logic
        if (this.currentRoom.player) {
            this.currentRoom.player.leftPress = this.controlPad.leftPress;
            this.currentRoom.player.rightPress = this.controlPad.rightPress;
            this.currentRoom.player.upPress = this.controlPad.upPress;
            this.currentRoom.player.downPress = this.controlPad.downPress;
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

        //if the phone button is pressed
        if (this.pauseChatButtons.phonePressed) {
            //prevent phone button from being continuously pressed by accident
            this.pauseChatButtons.phonePressed = false;
            //open the chat view
            // this.openChatView();
            this.openQuestionView();
        }
    }
}
