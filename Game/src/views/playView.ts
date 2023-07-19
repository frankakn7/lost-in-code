import * as Phaser from "phaser";
import RoomScene from "../rooms/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView/chatView";
import {ChatFlowNode} from "./chatView/chatFlowNode";
import ChatFlow from "./chatView/chatFlow";
import QuestionView from "./questionView/questionView";
import TaskManager from "./questionView/taskManager";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import MenuView from "./menuView";
import StoryManager from "../story_management/storyManager";

import strawHatTexture from "../assets/hats/strawHat.png";
import sorcerersHatTexture from "../assets/hats/redHat.png";
import truckerCapTexture from "../assets/hats/truckerCap.png"
import blackHatTexture from "../assets/hats/blackHat.png";
import sombreroTexture from "../assets/hats/sombrero.png";
import propellerHatTexture from "../assets/hats/propellerHat.png";
import crownTexture from "../assets/hats/crown.png";
import pirateHat from "../assets/hats/pirateHat.png";
import hatBg from "../assets/hats/hatBg.png";
import hatBgSelected from "../assets/hats/hatBgSelected.png";
import {HatMap} from "../hats/hats";
import HatView from "./hatView/hatView";

import tilesetPng from "../assets/tileset/station_tilemap.png";
import tilemapJson from "../tilemaps/engineRoom.json";
import {TilemapConfig} from "../types/tilemapConfig";

import commonRoomJson from "../assets/tilemaps/common.json";
import bridgeJson from "../assets/tilemaps/bridge.json";
import engineJson from "../assets/tilemaps/engine.json";
import hangarJson from "../assets/tilemaps/hangar.json";
import labJson from "../assets/tilemaps/laboratory.json";

import flaresJson from "../assets/particles/flares.json";
import flaresPng from "../assets/particles/flares.png";
import {GamestateType} from "../types/gamestateType";
import {globalEventBus} from "../helpers/globalEventBus";
import ApiHelper from "../helpers/apiHelper";
import ChapterManager, {ChapterType} from "./docView/chapterManager";
import DocView from "./docView/docView";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";
import NewsPopup from "../ui/newsPopup";



/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class PlayView extends Phaser.Scene {
    private roomMap = new Map<string, RoomScene>;

    private _state: GamestateType = {
        hats: {
            unlockedHats: [],
            selectedHat: "None"
        },
        playView: {
            currentRoom: "hangar"
        },
        room: {
            finishedTaskObjects: [
                false, false, false, false
            ],
        },
        story: {
            hangar: [],
            commonRoom: [],
            engine: [],
            laboratory: [],
            bridge: []
        },
        taskmanager: {
            answeredQuestions: [],
            currentChapterNumber: 1,
            repairedObjectsThisChapter: 0,
            currentPerformanceIndex: 1
        }
    };

    /**
     * The current room that the play view should show (and the player is in)
     */
    private currentRoom: RoomScene;

    private _startingRoomId: string = "hangar";
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
    private storyChatView: ChatView;

    private questionView: QuestionView;

    public menuView = new MenuView(this);

    private taskManager: TaskManager;

    private _storyManager = new StoryManager(this);

    public hatMap = HatMap;

    public hatView = new HatView(this);

    private taskQueue: Array<() => void> = [];

    private _news = [];
    private _newsCounter = 0;

    private apiHelper = new ApiHelper();

    public docView: DocView;

    /**
     * Opens the chat view by sending all other scenes to sleep and launching / awaking the chat view scene
     */
    private openStoryChatView(): void {
        //Send all scenes to sleep
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");

        //If the chat view already exists and is sleeping
        if (this.scene.isSleeping(this.storyChatView)) {
            //start a new chat flow and awake the scene
            this.storyChatView.startNewChatFlow(this._storyManager.pullNextStoryBit(this.currentRoom.getRoomId()));
            this.scene.wake(this.storyChatView);
            //If the chat view hasn't been launched yet
        } else {
            //create a new chat view
            this.storyChatView = new ChatView(this._storyManager.pullNextStoryBit(this.currentRoom.getRoomId()), "StoryChatView");
            //add chat view to the scene
            this.scene.add("StoryChatView", this.storyChatView);
            //launch the chat view
            this.scene.launch(this.storyChatView);
        }
    }

    public openTextChatView(text,customExitFunction:Function): void {
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");

        const simpleChatNode: ChatFlowNode = {text: text, optionText: "Start", choices: new Map<string, ChatFlowNode>}

        const simpleChatFlow = new ChatFlow(simpleChatNode)

        const textChatView = new ChatView(simpleChatFlow, "ChatTextView", true,customExitFunction)

        this.scene.add("ChatTextView", textChatView)
        this.scene.launch(textChatView)
    }

    onWake() {
        // Execute all tasks in the queue
        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (task) {
                task();
            }
        }
    }

    queueTask(task: () => void) {
        this.taskQueue.push(task);
    }

    public pullNextStoryBit(roomId) {
        console.log(roomId)
        return this._storyManager.pullNextStoryBit(roomId);
    }


    public broadcastNews(message) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopup(this, newsId,"Door unlocked!", 2500);
        this.scene.add(newsId, newsPopup);
        this.scene.launch(newsPopup);

        if (this._news.length > 0) {
            this._news.forEach((n) => {
                n.kill();
            })
        }
        this._news.push(newsPopup)
    }

    private openQuestionView(){
        //If the chat view already exists and is sleeping
        if (!this.docView.newChapter) {

            this.scene.sleep(this);
            this.scene.sleep("controlPad");
            this.scene.sleep("pauseChatButtons");
            this.scene.sleep("Room");
            if (this.scene.isSleeping(this.questionView)) {
                this.scene.wake(this.questionView);
                //If the chat view hasn't been launched yet
                // } else if(this.scene.isActive(this.questionView)){
                //     console.log(this.scene.isActive(this.questionView))
                //     return;
            } else {
                //create a new question view
                this.questionView = new QuestionView(this.taskManager);
                //add question view to the scene
                this.scene.add("questionView", this.questionView);
                //launch the question view
                this.scene.launch(this.questionView);
            }
        } else {
            this.docView.newChapter = false
            this.docView.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                this.openTextChatView(chapters.find(chapter => chapter.order_position == this.taskManager.currentChapterNumber).material,() => {
                    this.scene.remove("ChatTextView");
                    if (this.scene.isSleeping(this.questionView)) {
                        this.scene.wake(this.questionView);
                        //If the chat view hasn't been launched yet
                        // } else if(this.scene.isActive(this.questionView)){
                        //     console.log(this.scene.isActive(this.questionView))
                        //     return;
                    } else {
                        //create a new question view
                        this.questionView = new QuestionView(this.taskManager);
                        //add question view to the scene
                        this.scene.add("questionView", this.questionView);
                        //launch the question view
                        this.scene.launch(this.questionView);
                    }
                })
            });
        }
    }

    public preload() {

        this.load.image("backgroundTile", deviceBackgroundTilePng);
        this.load.image("strawHat", strawHatTexture);
        this.load.image("sorcerersHat", sorcerersHatTexture);
        this.load.image("blackHat", blackHatTexture);
        this.load.image("sombrero", sombreroTexture);
        this.load.image("propellerHat", propellerHatTexture);
        this.load.image("truckerCap", truckerCapTexture);
        this.load.image("hatBg", hatBg);
        this.load.image("hatBgSelected", hatBgSelected);
        this.load.image("tilesetImage", tilesetPng);
        this.load.image("crown", crownTexture);
        this.load.image("pirateHat", pirateHat);

        this.load.atlas("flares", flaresPng, flaresJson);
        // this.load.image("returnButtonTexture", ReturnButtonTexture);

    }

    /**
     * Play View constructor
     * @param initialRoomKey the room scene that the play view should start with
     * @param settingsConfig the standard settingsConfig object used for all scenes
     */
    constructor(
        state?: GamestateType,
    ) {
        super("Play");

        state ? this._state = state : null;

        this.roomMap.set("hangar", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: hangarJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "hangar", this).setNextRoom("commonRoom").setPlayerPosition(32 * 12, 32 * 3));
        this.roomMap.set("commonRoom", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: commonRoomJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "commonRoom", this).setNextRoom("engine").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("engine", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: engineJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "engine", this).setNextRoom("laboratory").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("laboratory", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: labJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "laboratory", this).setNextRoom("bridge").setPlayerPosition(32 * 2, 32 * 10));
        this.roomMap.set("bridge", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: bridgeJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "bridge", this).setPlayerPosition(32 * 2, 32 * 10));


        this.taskManager = new TaskManager(this, this._state.taskmanager)


        this.currentRoom = this.roomMap.get(this._startingRoomId);
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

        this.events.on('wake', this.onWake, this);
        this.events.on('sleep', () => {
            console.log("SLEEPING PLAY VIEW")
        })

        this.docView = new DocView(this, this._state.taskmanager.currentChapterNumber);

        globalEventBus.on("save_game", () => this.apiHelper.updateStateData(this.saveAllToGamestateType()))

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

        this.broadcastNews = this.broadcastNews.bind(this);
        globalEventBus.on("broadcast_news", (message) => {this.broadcastNews(message)})
    }

    //for testing purposes
    public update(time: number, delta: number): void {

        //TODO: Optimize the player control logic

        if (this.currentRoom.player) {
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
            // this.openStoryChatView();
            // this.getToRoomViaId("laboratory");
            //this.openQuestionView();
            //this.openTextChatView("Harry ist der hmmmm...")
            // console.log(this.saveAllToJSONString());
            this.broadcastNews("hoooray!")

        }

        if (this.pauseChatButtons.pausePressed) {
            this.pauseChatButtons.pausePressed = false;
            this.scene.launch(this.menuView);

            this.pauseOrResumeGame(true);
        }

    }

    public loadData() {
        this._startingRoomId = this._state.playView.currentRoom ? this._state.playView.currentRoom : this._startingRoomId;
    }


    public pauseOrResumeGame: Function = (pause) => {
        if (pause) {
            this.currentRoom.scene.pause();
            this.controlPad.scene.pause();
        } else {
            this.currentRoom.scene.resume();
            this.controlPad.scene.resume();
        }
    }

    public saveAllToGamestateType(): GamestateType {
        return {
            hats: this.hatView.saveAll(),
            playView: this.getCurrentRoom().getRoomId(),
            room: this.getCurrentRoom().saveAll(),
            story: this._storyManager.saveAll(),
            taskmanager: this.taskManager.saveAll()
        };
    }

    public getState() {
        return this._state;
    }
}
