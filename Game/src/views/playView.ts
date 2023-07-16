import * as Phaser from "phaser";
import RoomScene from "../rooms/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView/chatView";
import { ChatFlowNode } from "./chatView/chatFlowNode";
import ChatFlow from "./chatView/chatFlow";
import QuestionView from "./questionView/questionView";
import TaskManager from "./questionView/taskManager";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import MenuView from "./menuView";
import StoryManager from "../story_management/storyManager";

import strawHatTexture from "../assets/hats/strawHat.png";
import sorcerersHatTexture from "../assets/hats/redHat.png";
import blackHatTexture from "../assets/hats/blackHat.png";
import hatBg from "../assets/hats/hatBg.png";
import hatBgSelected from "../assets/hats/hatBgSelected.png";
import { HatMap } from "../hats/hats";
import HatView from "./hatView/hatView";

import tilesetPng from "../assets/tileset/station_tilemap.png";
import tilemapJson from "../tilemaps/engineRoom.json";
import { TilemapConfig } from "../types/tilemapConfig";

import commonRoomJson from "../assets/tilemaps/common.json";
import bridgeJson from "../assets/tilemaps/bridge.json";
import engineJson from "../assets/tilemaps/engine.json";
import hangarJson from "../assets/tilemaps/hangar.json";
import labJson from "../assets/tilemaps/laboratory.json";


/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class PlayView extends Phaser.Scene {
    private roomMap = new Map<string, RoomScene>;

    private doorMap = new Map<string, {}>

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
    
    public menuView = new MenuView(this);

    private taskManager: TaskManager = new TaskManager([]);

    private _storyManager = new StoryManager();

    public hatMap = HatMap;

    public hatView = new HatView(this);

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
            this.chatView.startNewChatFlow(this._storyManager.getNextStoryBit(this.currentRoom.getRoomId()));
            this.scene.wake(this.chatView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.chatView = new ChatView(this._storyManager.getNextStoryBit(this.currentRoom.getRoomId()));
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
            this.questionView = new QuestionView(this.taskManager);
            //add chat view to the scene
            this.scene.add("questionView", this.questionView);
            //launch the chat view
            this.scene.launch(this.questionView);
        }
    }

    public preload() {
        this.load.image("backgroundTile", deviceBackgroundTilePng);
        this.load.image("strawHat", strawHatTexture);
        this.load.image("sorcerersHat", sorcerersHatTexture);
        this.load.image("blackHat", blackHatTexture);
        this.load.image("hatBg", hatBg);
        this.load.image("hatBgSelected", hatBgSelected);
        this.load.image("tilesetImage", tilesetPng);
    }

    /**
     * Play View constructor
     * @param initialRoomKey the room scene that the play view should start with
     * @param settingsConfig the standard settingsConfig object used for all scenes
     */
    constructor(
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);

        this.roomMap.set("hangar", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: hangarJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "hangar", this).setNextRoom("commonRoom").setPlayerPosition(32*12,32*3));
        this.roomMap.set("commonRoom", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: commonRoomJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "commonRoom", this).setNextRoom("engine").setPlayerPosition(32*2, 32*10));
        this.roomMap.set("engine", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: engineJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "engine", this).setNextRoom("laboratory").setPlayerPosition(32*2, 32*10));
        this.roomMap.set("laboratory", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: labJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "laboratory", this).setNextRoom("bridge").setPlayerPosition(32*2, 32*10));
        this.roomMap.set("bridge", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: bridgeJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "bridge", this).setPlayerPosition(32*2, 32*10));
        
        
        


        this.currentRoom = this.roomMap.get("hangar");
    }

    /**
     * Get the currently displayed room
     * @returns the {@link currentRoom}
     */
    public getCurrentRoom(): RoomScene {
        return this.currentRoom;
    }


    public getToRoomViaId(id: string) {
        let nextRoom = this.roomMap.get(id);
        this.scene.stop(this.currentRoom)
        this.scene.launch(this.roomMap.get(id));
        this.currentRoom = nextRoom;
    }

    public create() {
        console.log("Launched");

        // Adds the scene and launches it... (if active is set to true on added scene it is launched directly)
        
        this.roomMap.forEach((value, key) => {
            this.scene.add(key, this.roomMap.get(key));
        })

        this.scene.launch(this.currentRoom);

        // TODO: Check if mobile

        //Adds the pause and phone buttons scene and launches it
        this.scene.add("pauseChatButtons", this.pauseChatButtons);
        this.scene.launch(this.pauseChatButtons);

        // Adds the controlpad scene and launches it
        this.scene.add("controlPad", this.controlPad);
        this.scene.launch(this.controlPad);

        // this.scene.get('Room').events.on('interacted_question_object', () => {
        //     this.openQuestionView();
        // });
        this.scene.add("menu", this.menuView);
    }

    //for testing purposes
    public update(time: number, delta: number): void {

        //TODO: Optimize the player control logic
        
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
        //     this.currentRoom.player.upEPress = true
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
            this.openChatView();
            // this.getToRoomViaId("laboratory");
            // this.openQuestionView();
        }

        if (this.pauseChatButtons.pausePressed) {
            this.pauseChatButtons.pausePressed = false;
            this.scene.launch(this.menuView);   

            this.pauseOrResumeGame(true);
        }

    }


    public pauseOrResumeGame :Function = (pause) =>{
        if (pause) {
            this.currentRoom.scene.pause();
            this.controlPad.scene.pause();
        } 
        else {
            this.currentRoom.scene.resume();
            this.controlPad.scene.resume();            
        }
    }
}
