import * as Phaser from "phaser";
import RoomScene from "../classes/room";
import ControlPadScene from "../ui/ControlPadScene";
import PauseChatButtons from "../ui/PauseChatButtons";
import ChatView from "./chatView";
import {ChatFlowNode} from "../classes/chat/chatFlowNode";
import ChatFlow from "../classes/chat/chatFlow";
import QuestionView from "./questionView/questionView";
import TaskManager from "../managers/taskManager";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import MenuView from "./menuView";
import StoryManager from "../managers/story_management/storyManager";

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
import {HatMap} from "../constants/hats";
import HatView from "./hatView";

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
import ChapterManager, {ChapterType} from "../managers/chapterManager";
import DocView from "./docView/docView";
import ReturnButtonTexture from "../assets/ui/Return-Button.png";
import NewsPopup from "../ui/newsPopup";
import AchievementManager from "../managers/achievementManager";
import {achievements} from "../constants/achievements";

import ATask5Texture from "../assets/achievements/badges_tasks/badge_tasks_5.png";
import ATask10Texture from "../assets/achievements/badges_tasks/badge_tasks_10.png";
import ATask20Texture from "../assets/achievements/badges_tasks/badge_tasks_20.png";
import ATask30Texture from "../assets/achievements/badges_tasks/badge_tasks_30.png";
import ATask40Texture from "../assets/achievements/badges_tasks/badge_tasks_40.png";
import ATask50Texture from "../assets/achievements/badges_tasks/badge_tasks_50.png";

import ALevels1Texture from "../assets/achievements/badges_levels/badge_level_1.png";
import ALevels2Texture from "../assets/achievements/badges_levels/badge_level_2.png";
import ALevels3Texture from "../assets/achievements/badges_levels/badge_level_3.png";
import ALevels4Texture from "../assets/achievements/badges_levels/badge_level_4.png";
import ALevels5Texture from "../assets/achievements/badges_levels/badge_level_5.png";

import ProgressBar from "../ui/progress";
import User from "../classes/user";



/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class RootNode extends Phaser.Scene {
    private roomMap = new Map<string, RoomScene>;

    private _state: GamestateType = {
        rootNode: {
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
        user: {
            answeredQuestionIds: [],
            chapterNumber: 1,
            repairedObjectsThisChapter: 0,
            performanceIndex: 1,
            unlockedHats: [],
            selectedHat: "None",
            newChapter: true,
        },
        achievements: {
            taskCounter: 0,
            unlocked: []
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
    private progressBar = new ProgressBar(this);

    public achievementManager: AchievementManager = new AchievementManager(this);

    /**
     * the chat view
     */
    private storyChatView: ChatView;

    // private questionView: QuestionView;
    private questionView: Phaser.Scene;

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

    private _user: User;

    public openStoryChatViewWithoutPulling() {
        this.scene.sleep();
        this.scene.sleep("controlPad");
        this.scene.sleep("pauseChatButtons");
        this.scene.sleep("Room");
        this.scene.wake(this.storyChatView);
    }

    /**
     * Opens the chat view by sending all other scenes to sleep and launching / awaking the chat view scene
     */
    public openStoryChatView(): void {
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


    public broadcastNews(message) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopup(this, newsId,message, 2500);
        this.scene.add(newsId, newsPopup);
        this.scene.launch(newsPopup);

        if (this._news.length > 0) {
            this._news.forEach((n) => {
                n.kill();
            })
        }
        this._news.push(newsPopup)
    }

    public broadcastAchievement(achievement) {
        let newsId = "newsPopup" + (this._newsCounter++).toString();
        let newsPopup = new NewsPopup(this, newsId,achievement.text, 2500, achievement.texture);
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
        if (!this._user.newChapter) {

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
            this._user.newChapter = false
            this.docView.chapterManager.updateChapters().then((chapters: ChapterType[]) => {
                this.openTextChatView(chapters.find(chapter => chapter.order_position == this._user.chapterNumber).material,() => {
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
        this.load.image("badge_tasks_5", ATask5Texture);
        this.load.image("badge_tasks_10", ATask10Texture);
        this.load.image("badge_tasks_20", ATask20Texture);
        this.load.image("badge_tasks_30", ATask30Texture);
        this.load.image("badge_tasks_40", ATask40Texture);
        this.load.image("badge_tasks_50", ATask50Texture);

        this.load.image("badge_levels_hangar", ALevels1Texture);
        this.load.image("badge_levels_common", ALevels2Texture);
        this.load.image("badge_levels_engine", ALevels3Texture);
        this.load.image("badge_levels_lab", ALevels4Texture);
        this.load.image("badge_levels_bridge", ALevels5Texture);

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
        userData?: any,
        state?: GamestateType,
    ) {
        super("Play");

        state ? this._state = state : null;

        console.log(this._state)
        this._user = userData ? new User(userData.id, userData.username, this._state.user) : new User();

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

        this.loadData();
        this.taskManager = new TaskManager(this)


        this.currentRoom = this.roomMap.get(this._startingRoomId);

        this.questionView = new QuestionView(this.taskManager);
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

        globalEventBus.on("save_game", () => this.apiHelper.updateStateData(this.saveAllToGamestateType()).
        catch((error) => {
            console.error(error);
        }))
        this.docView = new DocView(this, this._state.user.chapterNumber);

        // globalEventBus.on("save_game", () => this.apiHelper.updateStateData(this.saveAllToGamestateType()))

        // Adds the scene and launches it... (if active is set to true on added scene it is launched directly)

        this.roomMap.forEach((value, key) => {
            this.scene.add(key, this.roomMap.get(key));
        })

        this.scene.launch(this.currentRoom);

        // TODO: Check if mobile

        //Adds the pause and phone buttons scene and launches it
        this.scene.add("pauseChatButtons", this.pauseChatButtons);
        this.scene.launch(this.pauseChatButtons);

        this.scene.add("Progress Bar", this.progressBar);
        this.scene.launch(this.progressBar);

        // Adds the controlpad scene and launches it
        this.scene.add("controlPad", this.controlPad);
        this.scene.launch(this.controlPad);

        // this.scene.get('Room').events.on('interacted_question_object', () => {
        //     this.openQuestionView();
        // });
        this.scene.add("menu", this.menuView);

        this.broadcastNews = this.broadcastNews.bind(this);
        globalEventBus.on("broadcast_news", (message) => {this.broadcastNews(message)})
        this.broadcastAchievement = this.broadcastAchievement.bind(this);
        globalEventBus.on("broadcast_achievement", (achievement) => {this.broadcastAchievement(achievement)});
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


            globalEventBus.emit("broadcast_achievement", achievements["tasks_5"]);
        }

        if (this.pauseChatButtons.pausePressed) {
            this.pauseChatButtons.pausePressed = false;
            this.scene.launch(this.menuView);

            this.pauseOrResumeGame(true);
        }

    }

    public loadData() {
        if (this._state.rootNode.currentRoom)
            this._startingRoomId = this._state.rootNode.currentRoom
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
            rootNode: {
                currentRoom: this.getCurrentRoom().getRoomId()
            },
            room: this.getCurrentRoom().saveAll(),
            story: this._storyManager.saveAll(),
            user: this.user.saveState(),
            achievements: this.achievementManager.saveAll()
        };
    }

    public getState() {
        return this._state;
    }


    get user(): User {
        return this._user;
    }
}
